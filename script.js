//requires jquery-3.4.0.min.js, jquery-ui.min.js and styles for progressbars 
//progress bar classes .ui-progressbar, .ui-progressbar-value
$(document).ready(function () {
	$('#mainWindow').append('<button id="downloadButton">Start</button>')
	
	$('#testWindow2').append('<button id="downloadButton2">Start</button>')
	$('#downloadButton').click(function () {
	//	createProgressBarWindow('http://localhost:5000/api/progress_test')
		
		//createProgressBarWindow('http://localhost:5000/api/progress_test')
		
		const diaObj = new barWindow ('13','http://127.0.0.1:5000/api/progress_test/');
		diaObj.open($('#mainWindow'));

	})
	$('#downloadButton2').click(function () {
	const dd = new barWindow('14','http://127.0.0.1:5000/api/progress_test/');
	dd.open($('#testWindow2'));
	return false;
	});
	
	//const barObj = new ProgressBar ('13','12345');
	//barObj.appendElem('body');

})