const createObj = ( cv, id ) => {
	return function makeShape( e ) {
		let shape = document.createElement( 'div' );
		shape.id = "obj_" + ( ALL_OBJ.length + 1 );
		shape.className = 'canvas_obj';
		shape.style.width = '80px';
		shape.style.height = '80px';
		shape.style.top = '80px';
		shape.style.left = '80px';
		shape.style.backgroundColor = '#123456';
		cv.appendChild( shape );
		shape.addEventListener( 'mousedown', onMouseDownObj );
		ALL_OBJ.push( shape );

	}
}

const onMouseDownObj = ( e ) => {
	e.stopPropagation();
	let obj_sty = getObjById( e.currentTarget.id )
	let obj_ori_pos = [parseFloat( obj_sty.style.left ), parseFloat( obj_sty.style.top )]
	let mouse_pos = [e.clientX, e.clientY]
	console.log(mouse_pos);
	let moveObj = onMouseMoveObj( obj_ori_pos, obj_sty, mouse_pos );
	e.currentTarget.addEventListener( 'mousemove', moveObj );
	e.currentTarget.addEventListener( 'mouseup', onMouseUpObj( moveObj ) );
}

const onMouseMoveObj = ( obj_ori_pos, obj_sty, mouse_pos ) => {
	return ( e ) => {
		console.log( obj_sty.style.left );
		let displace = [e.clientX - mouse_pos[0], e.clientY - mouse_pos[1]];
		console.log(displace);
		obj_sty.style.left = obj_ori_pos[0] + displace[0] + 'px';
		obj_sty.style.top = obj_ori_pos[1] + displace[1] + 'px';
	}
}

const onMouseUpObj = ( moveObj ) => {
	return ( e ) => {
		e.currentTarget.removeEventListener( 'mousemove', moveObj );
	}
}

const getObjById = ( id ) => {
	return ALL_OBJ.filter( obj => obj.id == id )[0];
}


const ALL_OBJ = [];

let cv = document.getElementById( 'canvas' );
let rec_btn = document.getElementById( 'rec' );

rec_btn.addEventListener( 'click', createObj( cv, rec_btn.id ) ); 