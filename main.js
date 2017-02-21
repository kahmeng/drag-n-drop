//---- make cv obj ----//

const createObj = ( mouseDown, cv, id ) => {
    if ( id == "rec" ) {
        return makeShape( cv );
    } else if ( id == "txt" ) {
        return makeTxtBox( mouseDown, cv );
    }
}

const makeShape = ( cv ) => {
    return ( e ) => {
        let shape = document.createElement( 'div' );
        shape.id = "obj_" + ( ALL_OBJ.length + 1 );
        shape.className = 'canvas_obj canvas_obj_shape';
        shape.style.width = '80px';
        shape.style.height = '80px';
        shape.style.top = '80px';
        shape.style.left = '80px';
        shape.style.zIndex = 10;
        shape.borderPercent = [0, 0, 0, 0];
        shape.style.borderRadius = '0%';
        shape.style.backgroundColor = '#000000';
        cv.appendChild( shape );
        ALL_OBJ.push( shape );
    }
}

const makeTxtBox = ( mouseDown, cv ) => {
    return ( e ) => {
        let txt = document.createElement( 'textarea' );
        txt.id = "obj_" + ( ALL_OBJ.length + 1 );
        txt.className = 'canvas_obj canvas_obj_txt';
        txt.style.top = '80px';
        txt.style.left = '80px';
        txt.style.width = '300px';
        txt.style.height = '80px';
        txt.style.zIndex = 0;
        txt.borderPercent = [0, 0, 0, 0];
        txt.style.borderRadius = '0%';
        txt.style.fontSize = '20px';
        let blur = onBlur( cv, txt );
        txt.setAttribute( 'placeholder', 'double click to edit me' );
        txt.addEventListener( 'dblclick', onFocus( cv, mouseDown ) );
        txt.addEventListener( 'focus', onFocus( cv, mouseDown ) );
        txt.addEventListener( 'blur', blur( blur, mouseDown ) );
        cv.appendChild( txt );
        ALL_OBJ.push( txt );
    }   
}

// ---- Txt Effect ---- //

const onFocus = ( cv, mouseDown ) => {
    return ( e ) => {
        let txt_box = e.currentTarget;
        txt_box.focus();
        cv.removeEventListener( 'mousedown', mouseDown );
        cv.removeEventListener( 'mousemove', eventPreventDefault );
    }
}

const onBlur = ( cv, obj ) => {
    return ( func, mouseDown ) => {
        return ( e ) => {
            cv.addEventListener( 'mousedown', mouseDown );
            obj.style.height = obj.scrollHeight - 4 + 'px';
            obj.removeEventListener( 'blur', func );
            setHandle( obj );
            setBorder( obj.borderPercent );
            cv.addEventListener( 'mousemove', eventPreventDefault );
        }
    }
}

//------- Event -------//

const onMouseDownObj = ( body ) => {
    return ( e ) => {
        e.preventDefault();
        if ( e.target.id == 'canvas' ) {
            removeHandle();
            SELECTED = null;
            return false;
        }

    //---- Scale ----//
        else if ( e.target.id.split( '_' )[0] == 'handle' ) {
            let handle = e.target;
            let direction = handle.id.split( 'handle_' )[1];
            let obj_ori_pos = [parseFloat( SELECTED.style.left ), parseFloat( SELECTED.style.top )];
            let obj_ori_size = [parseFloat( SELECTED.style.width ), parseFloat( SELECTED.style.height )];
            let mouse_pos = [e.clientX, e.clientY];
            let scaleObj = onMouseMoveHandle( obj_ori_size, obj_ori_pos, SELECTED, mouse_pos, direction );
            body.addEventListener( 'mousemove', scaleObj );
            body.addEventListener( 'mouseup', onMouseUpHandle( scaleObj ) );
        }

    //---- Drag n drop ----//
        else {
            let obj_sty = getObjById( e.target.id )
            SELECTED = e.target;
            setHandle( obj_sty );
            addHandle();
            let obj_ori_pos = [parseFloat( obj_sty.style.left ), parseFloat( obj_sty.style.top )];
            let mouse_pos = [e.clientX, e.clientY];
            let moveObj = onMouseMoveObj( obj_ori_pos, obj_sty, mouse_pos );
            body.addEventListener( 'mousemove', moveObj );
            body.addEventListener( 'mouseup', onMouseUpObj( moveObj ) );
        }
    }
}

//---- Drag n drop ----//
const onMouseMoveObj = ( obj_ori_pos, obj_sty, mouse_pos ) => {
    return ( e ) => {
        e.preventDefault();
        let displace = [e.clientX - mouse_pos[0], e.clientY - mouse_pos[1]];
        obj_sty.style.left = obj_ori_pos[0] + displace[0] + 'px';
        obj_sty.style.top = obj_ori_pos[1] + displace[1] + 'px';
        setHandle( obj_sty );
    }
}

const onMouseUpObj = ( func ) => {
    return ( e ) => {
        e.currentTarget.removeEventListener( 'mousemove', func );
    }
}

//---- Scale ----//

const onMouseMoveHandle = ( obj_ori_size, obj_ori_pos, obj_sty, mouse_pos, direction ) => {
    return ( e ) => {
        e.preventDefault();
        let curr_mouse_pos = [e.clientX, e.clientY]
        let displace = [curr_mouse_pos[0] - mouse_pos[0], curr_mouse_pos[1] - mouse_pos[1]];
        let pos_mouse_end_left = [mouse_pos[0] - obj_ori_size[0], mouse_pos[1] - obj_ori_size[1]];
        let pos_mouse_end_right = [obj_ori_size[0] + mouse_pos[0], obj_ori_size[1] + mouse_pos[1]];
        let pos_end = [obj_ori_size[0] + obj_ori_pos[0], obj_ori_size[1] + obj_ori_pos[1]];
        switch ( direction ) {
            case 'nw':
                if ( curr_mouse_pos[0] < pos_mouse_end_right[0] - 1 ) {
                    obj_sty.style.width = obj_ori_size[0] - displace[0] + 'px';
                    obj_sty.style.left = obj_ori_pos[0] + displace[0] + 'px';
                } else {
                    obj_sty.style.width = 1 + 'px';
                    obj_sty.style.left = pos_end[0] - 1 + 'px';
                }
                if ( curr_mouse_pos[1] < pos_mouse_end_right[1] - 1 ) {
                    obj_sty.style.height = obj_ori_size[1] - displace[1] + 'px';
                    obj_sty.style.top = obj_ori_pos[1] + displace[1] + 'px';
                } else {
                    obj_sty.style.height = 1 + 'px';
                    obj_sty.style.top = pos_end[1] - 1 + 'px';
                }
                break;
            case 'n':
                if ( curr_mouse_pos[1] < pos_mouse_end_right[1] - 1 ) {
                    obj_sty.style.height = obj_ori_size[1] - displace[1] + 'px';
                    obj_sty.style.top = obj_ori_pos[1] + displace[1] + 'px';
                } else {
                    obj_sty.style.height = 1 + 'px';
                    obj_sty.style.top = pos_end[1] - 1 + 'px';
                }
                break;
            case 'ne':
                if ( curr_mouse_pos[0] > pos_mouse_end_left[0] + 1 ) {
                    obj_sty.style.width = obj_ori_size[0] + displace[0] + 'px';
                } else {
                    obj_sty.style.width = 1 + 'px';
                }
                if ( curr_mouse_pos[1] < pos_mouse_end_right[1] - 1 ) {
                    obj_sty.style.height = obj_ori_size[1] - displace[1] + 'px';
                    obj_sty.style.top = obj_ori_pos[1] + displace[1] + 'px';
                } else {
                    obj_sty.style.height = 1 + 'px';
                    obj_sty.style.top = pos_end[1] - 1 + 'px';
                }
                break;
            case 'e':
                if ( curr_mouse_pos[0] > pos_mouse_end_left[0] + 1 ) {
                    obj_sty.style.width = obj_ori_size[0] + displace[0] + 'px';
                } else {
                    obj_sty.style.width = 1 + 'px';
                }
                break;
            case 'se':
                if ( curr_mouse_pos[0] > pos_mouse_end_left[0] + 1 ) {
                    obj_sty.style.width = obj_ori_size[0] + displace[0] + 'px';
                } else {
                    obj_sty.style.width = 1 + 'px';
                }
                if ( curr_mouse_pos[1] > pos_mouse_end_left[1] + 1 ) {
                    obj_sty.style.height = obj_ori_size[1] + displace[1] + 'px';
                } else {
                    obj_sty.style.height = 1 + 'px';
                }
                break;
            case 's':
                if ( curr_mouse_pos[1] > pos_mouse_end_left[1] + 1 ) {
                    obj_sty.style.height = obj_ori_size[1] + displace[1] + 'px';
                } else {
                    obj_sty.style.height = 1 + 'px';
                }
                break;
            case 'sw':
                if ( curr_mouse_pos[0] < pos_mouse_end_right[0] - 1 ) {
                    obj_sty.style.width = obj_ori_size[0] - displace[0] + 'px';
                    obj_sty.style.left = obj_ori_pos[0] + displace[0] + 'px';
                } else {
                    obj_sty.style.width = 1 + 'px';
                    obj_sty.style.left = pos_end[0] - 1 + 'px';
                }
                if ( curr_mouse_pos[1] > pos_mouse_end_left[1] + 1 ) {
                    obj_sty.style.height = obj_ori_size[1] + displace[1] + 'px';
                } else {
                    obj_sty.style.height = 1 + 'px';
                }
                break;
            case 'w':
                if ( curr_mouse_pos[0] < pos_mouse_end_right[0] - 1 ) {
                    obj_sty.style.width = obj_ori_size[0] - displace[0] + 'px';
                    obj_sty.style.left = obj_ori_pos[0] + displace[0] + 'px';
                } else {
                    obj_sty.style.width = 1 + 'px';
                    obj_sty.style.left = pos_end[0] - 1 + 'px';
                }
                break;
        }
        setHandle( obj_sty );
        setBorder( SELECTED.borderPercent );
    }
}

const onMouseUpHandle = ( func ) => {
    return ( e ) => {
        e.currentTarget.removeEventListener( 'mousemove', func );
    }
}



const eventPreventDefault = ( e ) => {
    e.preventDefault();
}

const getObjById = ( id ) => {
    return ALL_OBJ.filter( obj => obj.id == id )[0];
}

//------- Helper -------//
const addMouseDownEvt = ( func, ele, ...other ) => {
    return ( e ) => {
    const evt = func( ...other );
        ele.addEventListener( 'mousemove', evt );
        ele.addEventListener( 'mouseup', addMouseUpEvt( evt, ele ) );
    }
}

const addMouseUpEvt = ( func, ele ) => {
    return ( e ) =>{
        ele.removeEventListener( 'mousemove', func );
        ele.removeEventListener( 'mouseup', func );
    }
}

const toggleShowHide = ( div ) => {
    return ( e ) => {
        if ( div.style.display == 'block' ) {
            div.style.display = 'none';
        } else {
            div.style.display = 'block';
        }
    }
}

const closeTool = ( tools ) => {
    return ( e ) => {
        if ( !e.target.classList.contains( 'canvas_obj' ) ) {
            tools.forEach( tool => tool.style.display = 'none' );
        }
    }
}

//---- handle ----//
const setHandle = ( obj_sty ) => {
    let pos = [parseFloat( obj_sty.style.left ), parseFloat( obj_sty.style.top )];
    let size = [parseFloat( obj_sty.style.width ), parseFloat( obj_sty.style.height )];
    let coor_x = [pos[0] - 7, pos[0] - 7 + size[0] / 2, pos[0] + size[0] - 7];
    let coor_y = [pos[1] - 7, pos[1] - 7 + size[1] / 2, pos[1] + size[1] - 7];

//  o -- o -- o       0 -- 1 -- 2
//  |         |       |         |
//  o         o ----> 7         3
//  |         |       |         |
//  o -- o -- o       6 -- 5 -- 4

    HANDLES[0].style.left = coor_x[0] + 'px';
    HANDLES[0].style.top  = coor_y[0] + 'px';

    HANDLES[1].style.left = coor_x[1] + 'px';
    HANDLES[1].style.top  = coor_y[0] + 'px';

    HANDLES[2].style.left = coor_x[2] + 'px';
    HANDLES[2].style.top  = coor_y[0] + 'px';

    HANDLES[3].style.left = coor_x[2] + 'px';
    HANDLES[3].style.top  = coor_y[1] + 'px';

    HANDLES[4].style.left = coor_x[2] + 'px';
    HANDLES[4].style.top  = coor_y[2] + 'px';

    HANDLES[5].style.left = coor_x[1] + 'px';
    HANDLES[5].style.top  = coor_y[2] + 'px';

    HANDLES[6].style.left = coor_x[0] + 'px';
    HANDLES[6].style.top  = coor_y[2] + 'px';

    HANDLES[7].style.left = coor_x[0] + 'px';
    HANDLES[7].style.top  = coor_y[1] + 'px';
}

const addHandle = () => {
    HANDLES.forEach( handle => handle.classList.remove( 'handle_remove' ) );
}

const removeHandle = () => {
    HANDLES.forEach( handle => handle.classList.add( 'handle_remove' ) );
}

//------- Tool -------//
//---- Color ----//

const colorBoard = ( all_color_div ) => {
    let f = ['1f', '3f', '5f', '7f', '9f', 'bf', 'df', 'ff', 'ff', 'ff', 'ff', 'ff', 'ff', 'ff'];
    let n = ['00', '00', '00', '00', '00', '00', '00', '1f', '3f', '5f', '7f', '9f', 'bf', 'df'];
    let h = ['1f', '2f', '3f', '4f', '5f', '6f', '7f', '8f', '9f', 'af', 'bf', 'cf', 'df', 'ef'];
    let b_and_w = colorGenerator( h, h, h );
    let red     = colorGenerator( f, n, n );
    let orange  = colorGenerator( f, h, n );
    let yellow  = colorGenerator( f, f, n );
    let light_g = colorGenerator( h, f, n );
    let green   = colorGenerator( n, f, n );
    let light_v = colorGenerator( n, f, h );
    let violet  = colorGenerator( n, f, f );
    let light_b = colorGenerator( n, h, f );
    let blue    = colorGenerator( n, n, f );
    let purple  = colorGenerator( h, n, f );
    let pink    = colorGenerator( f, n, f );
    let dark_p  = colorGenerator( f, n, h );
    let all_color = [b_and_w, red, orange, yellow, light_g, green, light_v, violet, light_b, blue, purple, pink, dark_p];
    let number_of_color = all_color.length;
    let color_pix = Array.apply( null, Array( number_of_color * f.length ) );
    color_pix.forEach( ( cp, i ) => {
        cp = document.createElement( 'span' );
        cp.className = 'color_pix';
        cp.style.backgroundColor = all_color[i % number_of_color][Math.floor( i / number_of_color )];
        cp.value = all_color[i % number_of_color][Math.floor( i / number_of_color )];
        all_color_div.appendChild( cp );
    } );
    all_color = ['#000000', '#ffffff', 'transparent']
    color_pix = Array.apply( null, Array( all_color.length ) );
    color_pix.forEach( ( cp, i ) => {
        cp = document.createElement( 'span' );
        cp.className = 'color_pix color_bwt';
        cp.style.backgroundColor = all_color[i];
        cp.value = all_color[i];
        all_color_div.appendChild( cp );
    } );

}

const colorGenerator = ( c1, c2, c3 ) => {
    return c1.map( ( c, i ) => '#' + c + c2[i] + c3[i] )
}

const setColor = ( color_display, hex_input, color_border ) => {
    return ( e ) => {
        if ( e.target.value ) {
            let hex_code = e.target.value;
            hex_input.value = hex_code;
            color_display.value = hex_code;
            color_display.style.backgroundColor = hex_code;

            if ( SELECTED ) {
                if ( color_border[0].checked ) {
                    SELECTED.style.borderColor = hex_code;
                    return false;
                } else {
                    let is_border = false;
                    if ( color_border[1].checked ) {
                        SELECTED.style.borderTopColor = hex_code;
                        is_border = true;
                    }
                    if ( color_border[2].checked ) {
                        SELECTED.style.borderRightColor = hex_code;
                        is_border = true;
                    }
                    if ( color_border[3].checked ) {
                        SELECTED.style.borderBottomColor = hex_code;
                        is_border = true;
                    }
                    if ( color_border[4].checked ) {
                        SELECTED.style.borderLeftColor = hex_code;
                        is_border = true;
                    }
                    if ( is_border ) {
                        return false;
                    }
                }
                let obj_type = SELECTED.classList[1].split('canvas_obj_')[1];
                if ( obj_type == 'shape' ) {
                    SELECTED.style.backgroundColor = hex_code;
                } else if ( obj_type == 'txt' ) {
                    SELECTED.style.color = hex_code;
                }
            }
        }
    }
}

const setCheck = ( color_border ) => {
    return ( e ) => {
        if ( color_border[1].checked == true && color_border[2].checked == true 
            && color_border[3].checked == true && color_border[4].checked == true ) {
            color_border[0].checked = true;
        } else {
            color_border[0].checked = false;
        }
        if ( e.target.id == 'color_border_a' && color_border[0].checked == false ) {
            color_border[0].checked = color_border[1].checked = color_border[2].checked = color_border[3].checked = color_border[4].checked = true;
        } else if ( e.target.id == 'color_border_a' && color_border[0].checked == true )
            color_border[0].checked = color_border[1].checked = color_border[2].checked = color_border[3].checked = color_border[4].checked = false;
    }
}


//----opacity----//
const setOpacity = ( opacity_value, opacity_range ) => {
    return ( e ) => {
        let val = parseFloat( e.target.value );
        val = val >= 0 && val <= 100 ? val : val ? 100 : '';
        opacity_value.value = opacity_range.value = val;
        if ( SELECTED && !val.isNaN ) {
            SELECTED.style.opacity = val / 100;
        }
    }
}

//----border radius----//
const setBorderRadius = ( border_radius_range, border_radius_value, coor_x ) => {
    return ( e ) => {
        let val = parseFloat( e.target.value );
        val = val >= 0 && val <= 50 ? val : val ? 50 : '';
        border_radius_value.value = border_radius_range.value = val;
        if ( SELECTED && !val.isNaN ) {
            let br = SELECTED.style.borderRadius.split('%');
            if ( br[1] == '' ) {
                SELECTED.style.borderRadius = coor_x ? val + '%/' + br[0] + '%' : br[0] + '%/' + val + '%';
            } else {
                SELECTED.style.borderRadius = coor_x ? val + '%/' + br[1] + '%' : br[0] + '%/' + val + '%';
            }
        }
    }
}

//----border----//
const setBorderPercent = ( border_range, border_value, border_range_o, border_value_o, type ) => {
    return ( e ) => {
        let val = parseFloat( e.target.value );
        if ( type == 'all' ) {
            val = val >= 0 && val <= 50 ? val : val ? 50 : '';
        } else {
            val = val >= 0 && val <= 100 ? val : val ? 100 : '';
        }
        border_range.value = border_value.value = val;
        if ( SELECTED && !val.isNaN ) {
            switch ( type ) {
                case 'all':
                    SELECTED.borderPercent = [val, val, val, val];
                    border_range_o.forEach( ele => ele.value = val );
                    border_value_o.forEach( ele => ele.value = val );
                    break;
                case 'top':
                    if ( val > ( 100 - SELECTED.borderPercent[2] ) ) {
                        SELECTED.borderPercent[0] = val;
                        SELECTED.borderPercent[2] = 100 - val;
                        border_range_o.value = border_value_o.value = 100 - val;
                    } else {
                        SELECTED.borderPercent[0] = val;
                    }
                    break;
                case 'right':
                    if ( val > ( 100 - SELECTED.borderPercent[3] ) ) {
                        SELECTED.borderPercent[1] = val;
                        SELECTED.borderPercent[3] = 100 - val;
                        border_range_o.value = border_value_o.value = 100 - val;
                    } else {
                        SELECTED.borderPercent[1] = val;
                    }
                    break;                    
                case 'bottom':
                    if ( val > ( 100 - SELECTED.borderPercent[0] ) ) {
                        SELECTED.borderPercent[2] = val;
                        SELECTED.borderPercent[0] = 100 - val;
                        border_range_o.value = border_value_o.value = 100 - val;
                    } else {
                        SELECTED.borderPercent[2] = val;
                    }
                    break;
                case 'left':
                    if ( val > ( 100 - SELECTED.borderPercent[1] ) ) {
                        SELECTED.borderPercent[3] = val;
                        SELECTED.borderPercent[1] = 100 - val;
                        border_range_o.value = border_value_o.value = 100 - val;
                    } else {
                        SELECTED.borderPercent[3] = val;
                    }
                    break;
            }
            setBorder( SELECTED.borderPercent );
        }
    }
}

const setBorder = ( percent ) => {
    let width = parseFloat( SELECTED.style.width );
    let height = parseFloat( SELECTED.style.height );
    SELECTED.style.borderTopWidth    = Math.ceil( percent[0] / 100 * height ) + 'px';
    SELECTED.style.borderRightWidth  = Math.ceil( percent[1] / 100 * width ) + 'px';
    SELECTED.style.borderBottomWidth = Math.ceil( percent[2] / 100 * height ) + 'px';
    SELECTED.style.borderLeftWidth   = Math.ceil( percent[3] / 100 * width ) + 'px';
}

//----font size----//

const fontSizeGenerator = ( select ) => {
    for ( let i = 1; i <= 170; i++ ) {
        let fs = document.createElement( 'option' );
        fs.value = i;
        fs.innerHTML = i + 'px';
        select.appendChild( fs );
    }
}

const setFontSize = (  ) => {
    return ( e ) => {
        if ( SELECTED && SELECTED.style.fontSize ) {
            SELECTED.style.fontSize = e.target.value + 'px';
        } 
    }
}

//----layer----//
const setZIndex = ( to_font ) => {
    return ( e ) => {
        if ( SELECTED ) {
            let z = parseFloat( SELECTED.style.zIndex );
            SELECTED.style.zIndex = to_font ? z + 1 : z <= 0 ? 0 : z - 1;
        }
    }
}

//------- initial -------//
//---- cv ----//

const ALL_OBJ = [];
let SELECTED = null;
let body = document.getElementById( 'body' );

let cv = document.getElementById( 'canvas' );
let mouseDown = onMouseDownObj( body );
cv.addEventListener( 'mousedown', mouseDown );
cv.addEventListener( 'mousemove', eventPreventDefault );

//---- btn ----//

let rec_btn = document.getElementById( 'rec' );
let txt_btn = document.getElementById( 'txt' );
rec_btn.addEventListener( 'click', createObj( mouseDown, cv, rec_btn.id ) ); 
txt_btn.addEventListener( 'click', createObj( mouseDown, cv, txt_btn.id ) );


//---- color ----//
let color_pix = document.getElementById( 'all_color' );
let color_btn = document.getElementById( 'color_btn' );
let color_board = document.getElementById( 'color_board' );
let color_display = document.getElementById( 'color_display' );
let color_border = document.getElementById( 'color_border' );
let color_border_input = color_border.getElementsByTagName( 'input' );
let hex_input = document.getElementById( 'hex_input' );
colorBoard( color_pix );
color_btn.addEventListener( 'click', toggleShowHide( color_board ) )
color_pix.addEventListener( 'click', setColor( color_display, hex_input, color_border_input ) );
color_border.addEventListener( 'click', setCheck( color_border_input ) );
hex_input.addEventListener( 'keyup', setColor( color_display, hex_input, color_border_input ) );

// ----opacity----// 
let opacity_btn = document.getElementById( 'opacity_btn' );
let opacity_display = document.getElementById( 'opacity_display' );
let opacity_range = document.getElementById( 'opacity_range' );
let opacity_value = document.getElementById( 'opacity_value' );
opacity_btn.addEventListener( 'click', toggleShowHide( opacity_display ) );
opacity_range.addEventListener( 'mousedown', addMouseDownEvt( setOpacity, opacity_range, opacity_range, opacity_value ) );
opacity_value.addEventListener( 'keyup', setOpacity( opacity_range, opacity_value ) );
opacity_range.addEventListener( 'click', setOpacity( opacity_range, opacity_value ) );

//----border radius----//
let border_radius_btn = document.getElementById( 'border_radius_btn' );
let border_radius_display = document.getElementById( 'border_radius_display' );
let border_radius_range_x = document.getElementById( 'border_radius_range_x' );
let border_radius_range_y = document.getElementById( 'border_radius_range_y' );
let border_radius_value_x = document.getElementById( 'border_radius_value_x' );
let border_radius_value_y = document.getElementById( 'border_radius_value_y' );
border_radius_btn.addEventListener( 'click', toggleShowHide( border_radius_display ) );
border_radius_range_x.addEventListener( 'mousedown', addMouseDownEvt( setBorderRadius, border_radius_range_x, border_radius_range_x, border_radius_value_x, true ) );
border_radius_range_y.addEventListener( 'mousedown', addMouseDownEvt( setBorderRadius, border_radius_range_y, border_radius_range_y, border_radius_value_y, false ) );
border_radius_value_x.addEventListener( 'keyup', setBorderRadius( border_radius_range_x, border_radius_value_x, true ) );
border_radius_value_y.addEventListener( 'keyup', setBorderRadius( border_radius_range_y, border_radius_value_y, false ) );
border_radius_range_x.addEventListener( 'click', setBorderRadius( border_radius_range_x, border_radius_value_x, true ) );
border_radius_range_y.addEventListener( 'click', setBorderRadius( border_radius_range_y, border_radius_value_y, false ) );

//----border----//
let border_btn = document.getElementById( 'border_btn' );
let border_display = document.getElementById( 'border_display' );
let border_range_all = document.getElementById( 'border_range_all' );
let border_value_all = document.getElementById( 'border_value_all' );
let border_range_t = document.getElementById( 'border_range_t' );
let border_value_t = document.getElementById( 'border_value_t' );
let border_range_r = document.getElementById( 'border_range_r' );
let border_value_r = document.getElementById( 'border_value_r' );
let border_range_b = document.getElementById( 'border_range_b' );
let border_value_b = document.getElementById( 'border_value_b' );
let border_range_l = document.getElementById( 'border_range_l' );
let border_value_l = document.getElementById( 'border_value_l' );
border_btn.addEventListener( 'click', toggleShowHide( border_display ) );
border_range_all.addEventListener( 'mousedown', addMouseDownEvt( setBorderPercent, border_range_all, border_range_all, border_value_all, [border_range_b, border_range_l, border_range_t, border_range_r], [border_value_b, border_value_l, border_value_t, border_value_r], 'all' ) );
border_range_t.addEventListener( 'mousedown', addMouseDownEvt( setBorderPercent, border_range_t, border_range_t, border_value_t, border_range_b, border_value_b, 'top' ) );
border_range_r.addEventListener( 'mousedown', addMouseDownEvt( setBorderPercent, border_range_r, border_range_r, border_value_r, border_range_l, border_value_l, 'right' ) );
border_range_b.addEventListener( 'mousedown', addMouseDownEvt( setBorderPercent, border_range_b, border_range_b, border_value_b, border_range_t, border_value_t, 'bottom' ) );
border_range_l.addEventListener( 'mousedown', addMouseDownEvt( setBorderPercent, border_range_l, border_range_l, border_value_l, border_range_r, border_value_r, 'left' ) );
border_value_all.addEventListener( 'keyup', setBorderPercent( border_range_all, border_value_all, [border_range_b, border_range_l, border_range_t, border_range_r], [border_value_b, border_value_l, border_value_t, border_value_r], 'all' ) );
border_value_t.addEventListener( 'keyup', setBorderPercent( border_range_t, border_value_t, border_range_b, border_value_b, 'top' ) );
border_value_r.addEventListener( 'keyup', setBorderPercent( border_range_r, border_value_r, border_range_l, border_value_l, 'right' ) );
border_value_b.addEventListener( 'keyup', setBorderPercent( border_range_b, border_value_b, border_range_t, border_value_t, 'bottom' ) );
border_value_l.addEventListener( 'keyup', setBorderPercent( border_range_l, border_value_l, border_range_r, border_value_r, 'left' ) );
border_range_all.addEventListener( 'click', setBorderPercent( border_range_all, border_value_all, [border_range_b, border_range_l, border_range_t, border_range_r], [border_value_b, border_value_l, border_value_t, border_value_r], 'all' ) );
border_range_t.addEventListener( 'click', setBorderPercent( border_range_t, border_value_t, border_range_b, border_value_b, 'top' ) );
border_range_r.addEventListener( 'click', setBorderPercent( border_range_r, border_value_r, border_range_l, border_value_l, 'right' ) );
border_range_b.addEventListener( 'click', setBorderPercent( border_range_b, border_value_b, border_range_t, border_value_t, 'bottom' ) );
border_range_l.addEventListener( 'click', setBorderPercent( border_range_l, border_value_l, border_range_r, border_value_r, 'left' ) );

//----font size----//
let font_size_btn = document.getElementById( 'font_size_btn' );
let font_size_display = document.getElementById( 'font_size_display' );
font_size_btn.addEventListener( 'click', toggleShowHide( font_size_display ) );
font_size_display.addEventListener( 'change', setFontSize(  ) );
fontSizeGenerator( font_size_display );

//----layer----//
let layer_btn = document.getElementById( 'layer_btn' );
let layer_display = document.getElementById( 'layer_display' );
let send_to_back = document.getElementById( 'send_to_back' );
let bring_to_font = document.getElementById( 'bring_to_font' );
layer_btn.addEventListener( 'click', toggleShowHide( layer_display ) );
send_to_back.addEventListener( 'click', setZIndex( false ) );
bring_to_font.addEventListener( 'click', setZIndex( true ) );




let tools = [color_board, opacity_display, border_radius_display, border_display, font_size_display, layer_display];

//---- handle ----//
let HANDLES = Array.prototype.slice.call( document.getElementsByClassName( 'handle' ) );
cv.addEventListener( 'mousedown', closeTool( tools ) );
