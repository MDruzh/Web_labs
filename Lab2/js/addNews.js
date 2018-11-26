function isOnline() {
    return window.navigator.onLine;
}

const feedback = (name, text,photo) => ` 
    <div class="col-lg-3" style="margin-left: 5%;">
		<img src=${photo} style="height:300px; width: 400px; margin-top: 3%;">
		<div style="width: 400px; height: 90px; border: 2px solid blue; margin-top: 2%">
		<h1 style="text-align: center;">${name}</h1>
		</div>
		<div style="width: 400px; height: 400px; border: 2px solid blue; margin-top: 2%">
		<p style="padding-left: 2%; padding-top: 2%; padding-right: 2%; font-size: 21px;">${text}</p>
		</div>
	</div>
`

function addElementNews(){
	if(isOnline()){
		console.log("Виконано");
		for(var i = 0; i < JSON.parse(localStorage.getItem("list_news")).length ;i++){
			$('#news').prepend(
		    	feedback(JSON.parse(localStorage.getItem("list_news"))[i].name,
		    		JSON.parse(localStorage.getItem("list_news"))[i].text,
		    		JSON.parse(localStorage.getItem("list_news"))[i].photo)
		  	);
		}
	}
}

addElementNews();