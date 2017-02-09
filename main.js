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
            cv.addEventListener( 'mousemove', eventPreventDefault );
        }
    }
}

//------- Event -------//

const onMouseDownObj = ( body ) => {
    return ( e ) => {
        e.preventDefault();
        // while ( !e.target.id ) {
        //     e.target.id = e.target.parentNode.id;
        // }
        if ( e.target.id == 'canvas' ) {
            removeHandle();
            SELECTED = null;
            return false;
        }

    //---- Scale ----//
        else if ( e.target.id.split( '_' )[0] == 'handle' ) {
            console.log(e.target)
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
                if ( curr_mouse_pos[0] < pos_mouse_end_right[0] - 10 ) {
                    obj_sty.style.width = obj_ori_size[0] - displace[0] + 'px';
                    obj_sty.style.left = obj_ori_pos[0] + displace[0] + 'px';
                } else {
                    obj_sty.style.width = 10 + 'px';
                    obj_sty.style.left = pos_end[0] - 10 + 'px';
                }
                if ( curr_mouse_pos[1] < pos_mouse_end_right[1] - 10 ) {
                    obj_sty.style.height = obj_ori_size[1] - displace[1] + 'px';
                    obj_sty.style.top = obj_ori_pos[1] + displace[1] + 'px';
                } else {
                    obj_sty.style.height = 10 + 'px';
                    obj_sty.style.top = pos_end[1] - 10 + 'px';
                }
                break;
            case 'n':
                if ( curr_mouse_pos[1] < pos_mouse_end_right[1] - 10 ) {
                    obj_sty.style.height = obj_ori_size[1] - displace[1] + 'px';
                    obj_sty.style.top = obj_ori_pos[1] + displace[1] + 'px';
                } else {
                    obj_sty.style.height = 10 + 'px';
                    obj_sty.style.top = pos_end[1] - 10 + 'px';
                }
                break;
            case 'ne':
        console.log( curr_mouse_pos[0] , pos_mouse_end_left[0] + 10 )

                if ( curr_mouse_pos[0] > pos_mouse_end_left[0] + 10 ) {
                    obj_sty.style.width = obj_ori_size[0] + displace[0] + 'px';
                } else {
                    obj_sty.style.width = 10 + 'px';
                }
                if ( curr_mouse_pos[1] < pos_mouse_end_right[1] - 10 ) {
                    obj_sty.style.height = obj_ori_size[1] - displace[1] + 'px';
                    obj_sty.style.top = obj_ori_pos[1] + displace[1] + 'px';
                } else {
                    obj_sty.style.height = 10 + 'px';
                    obj_sty.style.top = pos_end[1] - 10 + 'px';
                }
                break;
            case 'e':
                if ( curr_mouse_pos[0] > pos_mouse_end_left[0] + 10 ) {
                    obj_sty.style.width = obj_ori_size[0] + displace[0] + 'px';
                } else {
                    obj_sty.style.width = 10 + 'px';
                }
                break;
            case 'se':
                if ( curr_mouse_pos[0] > pos_mouse_end_left[0] + 10 ) {
                    obj_sty.style.width = obj_ori_size[0] + displace[0] + 'px';
                } else {
                    obj_sty.style.width = 10 + 'px';
                }
                if ( curr_mouse_pos[1] > pos_mouse_end_left[1] + 10 ) {
                    obj_sty.style.height = obj_ori_size[1] + displace[1] + 'px';
                } else {
                    obj_sty.style.height = 10 + 'px';
                }
                break;
            case 's':
                if ( curr_mouse_pos[1] > pos_mouse_end_left[1] + 10 ) {
                    obj_sty.style.height = obj_ori_size[1] + displace[1] + 'px';
                } else {
                    obj_sty.style.height = 10 + 'px';
                }
                break;


            case 'sw':
                if ( curr_mouse_pos[0] < pos_mouse_end_right[0] - 10 ) {
                    obj_sty.style.width = obj_ori_size[0] - displace[0] + 'px';
                    obj_sty.style.left = obj_ori_pos[0] + displace[0] + 'px';
                } else {
                    obj_sty.style.width = 10 + 'px';
                    obj_sty.style.left = pos_end[0] - 10 + 'px';
                }
                if ( curr_mouse_pos[1] > pos_mouse_end_left[1] + 10 ) {
                    obj_sty.style.height = obj_ori_size[1] + displace[1] + 'px';
                } else {
                    obj_sty.style.height = 10 + 'px';
                }
                break;
            case 'w':
                if ( curr_mouse_pos[0] < pos_mouse_end_right[0] - 10 ) {
                    obj_sty.style.width = obj_ori_size[0] - displace[0] + 'px';
                    obj_sty.style.left = obj_ori_pos[0] + displace[0] + 'px';
                } else {
                    obj_sty.style.width = 10 + 'px';
                    obj_sty.style.left = pos_end[0] - 10 + 'px';
                }
                break;
        }
        setHandle( obj_sty );
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
        tools.forEach( tool => tool.style.display = 'none' );
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
}

const colorGenerator = ( c1, c2, c3 ) => {
    return c1.map( ( c, i ) => '#' + c + c2[i] + c3[i] )
}

const setColor = ( color_display, hex_input ) => {
    return ( e ) => {
        if ( e.target.value ) {
            let hex_code = e.target.value;
            hex_input.value = hex_code;
            color_display.value = hex_code;
            color_display.style.backgroundColor = hex_code;

            if ( SELECTED ) {
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
let hex_input = document.getElementById( 'hex_input' );
colorBoard( color_pix );
color_btn.addEventListener( 'click', toggleShowHide( color_board ) )
color_pix.addEventListener( 'click', setColor( color_display, hex_input ) );
hex_input.addEventListener( 'keyup', setColor( color_display, hex_input ) );

let tools = [color_board];

//---- handle ----//
let HANDLES = Array.prototype.slice.call( document.getElementsByClassName( 'handle' ) );
// HANDLES.forEach( handle => handle.addEventListener( 'mousedown', onMouseDownHandle( handle ) ) ); 
cv.addEventListener( 'click', closeTool( tools ) );
