export function exportString(filename, exportString, type='text/json'){
	let expData = new Blob([exportString], { type });
    const csvUrl = URL.createObjectURL(expData);
    const A = document.createElement("A");;
    try{
	    A.setAttribute('download', filename);
	    A.setAttribute('href', csvUrl);
	    //A.click();
	    A.dispatchEvent(new MouseEvent(`click`, {bubbles: true, cancelable: true, view: window})); // FF fix
	} catch (exc){
		// ...
	}

	setTimeout(()=>{
		try{URL.revokeObjectURL(csvUrl);} catch (exc){}
		try{expData.dispose();} catch(exc){}
		try{A.remove();} catch(exc){}
		expData = null;
	},30000);
}
