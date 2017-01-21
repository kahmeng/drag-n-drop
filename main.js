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
        let shape = document.createElement( 'div' );
        shape.id = "obj_" + ( ALL_OBJ.length + 1 );
        shape.className = 'canvas_obj canvas_obj_txt';
        shape.style.top = '80px';
        shape.style.left = '80px';
        cv.appendChild( shape );
        let txt = document.createElement( 'textarea' );
        let blur = onBlur( cv, txt );
        shape.appendChild( txt );
        txt.addEventListener( 'dblclick', onFocus( cv ) );
        txt.addEventListener( 'focus', onFocus( cv ) );
        txt.addEventListener( 'blur', blur( blur ) );
        console.log('dblclick on ' + shape.id)
        ALL_OBJ.push( shape );
    }   
}

const onFocus = ( cv ) => {
    return ( e ) => {
        let txt_box = e.currentTarget
        console.log('remove mousse down')
        txt_box.focus();
        cv.removeEventListener( 'mousedown', onMouseDownObj );
        console.log('blur on ' + txt_box.id)
    }
}

const onBlur = ( cv, obj ) => {
    return ( func ) => {
        return ( e ) => {
            cv.addEventListener( 'mousedown', onMouseDownObj );
        console.log('add mousse down')
            obj.removeEventListener( 'blur', func );
        console.log('blur on ' + obj.id)

        }
    }
}

const onMouseDownObj = ( e ) => {
    e.preventDefault();
    while ( !e.target.id ) {
        e.target.id = e.target.parentNode.id;
    }
    let obj_sty = getObjById( e.target.id )
    if ( e.target.id == "canvas" ) {
        return false;
    }
    let obj_ori_pos = [parseFloat( obj_sty.style.left ), parseFloat( obj_sty.style.top )]
    let mouse_pos = [e.clientX, e.clientY]
    // console.log(mouse_pos);
    let moveObj = onMouseMoveObj( obj_ori_pos, obj_sty, mouse_pos );
    e.currentTarget.addEventListener( 'mousemove', moveObj );
    e.currentTarget.addEventListener( 'mouseup', onMouseUpObj( moveObj ) );
}

const onMouseMoveObj = ( obj_ori_pos, obj_sty, mouse_pos ) => {
    return ( e ) => {
        // console.log( obj_sty.style.left );
        let displace = [e.clientX - mouse_pos[0], e.clientY - mouse_pos[1]];
        // console.log(displace);
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


const ALL_OBJ = [];
let cv = document.getElementById( 'canvas' );
let rec_btn = document.getElementById( 'rec' );
let txt_btn = document.getElementById( 'txt' );

cv.addEventListener( 'mousedown', onMouseDownObj )
rec_btn.addEventListener( 'click', createObj( cv, rec_btn.id ) ); 
txt_btn.addEventListener( 'click', createObj( cv, txt_btn.id ) ); 