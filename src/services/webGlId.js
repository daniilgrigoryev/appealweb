export default function webGlId(){
    String.prototype.hashCode = function () {
        var hash = 0;
        if (this.length === 0)
            return hash;
        for (var i = 0; i < this.length; i++) {
            var character = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + character;
            hash = hash & hash;
        }
        return hash;
    };

    var canvas =null; 

    try{
	    canvas = document.createElement('canvas');
	    canvas.style.width = '1px';     
	    canvas.style.height = '1px';     
	    document.body.appendChild(canvas);

	//    var canvas = $('<canvas />', {width: '1', height: '1'}).appendTo('body');
	//  var gl = canvas[0].getContext("webgl");
	    var gl = canvas.getContext("webgl");
	    var sum = '';
	    for (var a in gl) {
	        if (typeof gl[a] !== 'function') {
	            sum += a + ':' + gl[a] + '\n';
	        }
	    }
	} finally {
    	canvas && (canvas.remove());
	}
    return sum.hashCode();
};