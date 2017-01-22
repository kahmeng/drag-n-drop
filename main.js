const createObj = ( cv, id ) => {
    if ( id == "rec" ) {
        return makeShape;
    } else if ( id == "txt" ) {
        return makeTxtBox( cv );
    }
}

const makeShape = ( e ) => {
    let shape = document.createElement( 'div' );
    shape.id = "obj_" + ( ALL_OBJ.length + 1 );
    shape.className = 'canvas_obj canvas_obj_shape';
    shape.style.width = '80px';
    shape.style.height = '80px';
    shape.style.top = '80px';
    shape.style.left = '80px';
    shape.style.backgroundColor = '#654321';
    cv.appendChild( shape );
    ALL_OBJ.push( shape );
}

const makeTxtBox = ( cv ) => {
    return ( e ) => {
        let txt = document.createElement( 'textarea' );
        txt.id = "obj_" + ( ALL_OBJ.length + 1 );
        txt.className = 'canvas_obj canvas_obj_txt';
        txt.style.top = '80px';
        txt.style.left = '80px';
        let blur = onBlur( cv, txt );
        txt.setAttribute( 'placeholder', 'double click to edit me' );
        txt.addEventListener( 'dblclick', onFocus( cv ) );
        txt.addEventListener( 'focus', onFocus( cv ) );
        txt.addEventListener( 'blur', blur( blur ) );
        cv.appendChild( txt );
        ALL_OBJ.push( txt );
    }   
}

const onFocus = ( cv ) => {
    return ( e ) => {
        let txt_box = e.currentTarget
        txt_box.focus();
        cv.removeEventListener( 'mousedown', onMouseDownObj );
    }
}

const onBlur = ( cv, obj ) => {
    return ( func ) => {
        return ( e ) => {
            cv.addEventListener( 'mousedown', onMouseDownObj );
            obj.removeEventListener( 'blur', func );
        }
    }
}

const onMouseDownObj = ( e ) => {
    e.preventDefault();
    // while ( !e.target.id ) {
    //     e.target.id = e.target.parentNode.id;
    // }
    let obj_sty = getObjById( e.target.id )
    if ( e.target.id == "canvas" ) {
        SELECTED = null;
        return false;
    }
    let obj_ori_pos = [parseFloat( obj_sty.style.left ), parseFloat( obj_sty.style.top )];
    let mouse_pos = [e.clientX, e.clientY];
    SELECTED = e.target;
    let moveObj = onMouseMoveObj( obj_ori_pos, obj_sty, mouse_pos );
    e.currentTarget.addEventListener( 'mousemove', moveObj );
    e.currentTarget.addEventListener( 'mouseup', onMouseUpObj( moveObj ) );
}

const onMouseMoveObj = ( obj_ori_pos, obj_sty, mouse_pos ) => {
    return ( e ) => {
        e.preventDefault();
        let displace = [e.clientX - mouse_pos[0], e.clientY - mouse_pos[1]];
        obj_sty.style.left = obj_ori_pos[0] + displace[0] + 'px';
        obj_sty.style.top = obj_ori_pos[1] + displace[1] + 'px';
    }
}

const onMouseUpObj = ( func ) => {
    return ( e ) => {
        e.currentTarget.removeEventListener( 'mousemove', func );
    }
}

const getObjById = ( id ) => {
    return ALL_OBJ.filter( obj => obj.id == id )[0];
}

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

const toggleShowHide = ( div ) => {
    return ( e ) => {
        if ( div.style.display == 'block' ) {
            div.style.display = 'none';
        } else {
            div.style.display = 'block';
        }
    }
}

const ALL_OBJ = [];
let SELECTED = null;

let cv = document.getElementById( 'canvas' );
let rec_btn = document.getElementById( 'rec' );
let txt_btn = document.getElementById( 'txt' );
cv.addEventListener( 'mousedown', onMouseDownObj );
cv.addEventListener( 'mousemove', ( e ) => e.preventDefault() );
rec_btn.addEventListener( 'click', createObj( cv, rec_btn.id ) ); 
txt_btn.addEventListener( 'click', createObj( cv, txt_btn.id ) );

// ---all about color--- //
let color_pix = document.getElementById( 'all_color' );
let color_btn = document.getElementById( 'color_btn' );
let color_board = document.getElementById( 'color_board' );
let color_display = document.getElementById( 'color_display' );
let hex_input = document.getElementById( 'hex_input' );
colorBoard( color_pix );
color_btn.addEventListener( 'click', toggleShowHide( color_board ) )
color_pix.addEventListener( 'click', setColor( color_display, hex_input ) );
hex_input.addEventListener( 'keyup', setColor( color_display, hex_input ) )