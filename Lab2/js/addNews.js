//Labs 7,8

// function isOnline() {
//     return window.navigator.onLine;
// }

// const feedback = (name, text,photo) => ` 
//     <div class="col-lg-3" style="margin-left: 5%;">
// 		<img src=${photo} style="height:300px; width: 400px; margin-top: 3%;">
// 		<div style="width: 400px; height: 90px; border: 2px solid blue; margin-top: 2%">
// 		<h1 style="text-align: center;">${name}</h1>
// 		</div>
// 		<div style="width: 400px; height: 400px; border: 2px solid blue; margin-top: 2%">
// 		<p style="padding-left: 2%; padding-top: 2%; padding-right: 2%; font-size: 21px;">${text}</p>
// 		</div>
// 	</div>
// `

// function addElementNews(){
// 	if(isOnline()){
// 		console.log("Виконано");
// 		for(var i = 0; i < JSON.parse(localStorage.getItem("list_news")).length ;i++){
// 			$('#news').prepend(
// 		    	feedback(JSON.parse(localStorage.getItem("list_news"))[i].name,
// 		    		JSON.parse(localStorage.getItem("list_news"))[i].text,
// 		    		JSON.parse(localStorage.getItem("list_news"))[i].photo)
// 		  	);
// 		}
// 	}
// }

// addElementNews();



//Lab 9

var useLocalStorage = false;

const feedback = (name, text,photo) => ` 
    <div class="col-lg-3">
		<img src=${photo} style="height:25%;width: 100%;">
		<h3>${name}</h3>
		<p>${text}</p>
	</div>
`

class News{
  constructor(title, desc, image){
    this.title = title;
    this.desc = desc;
    this.image = image;
  }
}

function getNews() {
    var news = new Array;
    var news_item = localStorage.getItem('news');
    if (news_item !== null) {
        news = JSON.parse(news_item);
    }
    return news;
}

function addNews(){
  
  var imageForm = document.getElementById("userInputFile");
  var title = document.getElementById("title");
  var desc = document.getElementById("description");
  var image = document.getElementById("user-image");
  if (title.value == ""){
    alert("Введіть заголовок!");
    return;
  }
  if (desc.value == ""){
    alert("Введіть опис статті!");
    return;
  }
  var news = new News(title.value, desc.value, image.src);
  addToStorage(news);
  title.value = "";
  desc.value = "";
  imageForm.value = "";
}

function addToStorage(newsItem){
    if(useLocalStorage){
       var news = getNews();
       news.push(newsItem);
       localStorage.setItem('news', JSON.stringify(news));
       return false;
    }
    else {
      var openDB = indexedDB.open("news", 1);

      openDB.onupgradeneeded = function() {
        var db = openDB.result;
        var store = db.createObjectStore("news", {keyPath: "title"});
        store.createIndex("title", "title", {unique: false});
        store.createIndex("desc", "desc", {unique: false});
        store.createIndex("image", "image", {unique: false});
      };
      openDB.onerror = function(event) {
        alert("Error when adding feedback to DataBase");
      };

      openDB.onsuccess = function(event) {
        var db = openDB.result;
        var trans = db.transaction(["news"], "readwrite");
        var store = trans.objectStore("news");
        var add = store.put(newsItem);
        add.onsuccess = function(event){
          alert("News added");
        }
        add.onerror = function(event){
          alert("Error when adding Feedback");
        }
        trans.oncomplete = function(){
          db.close();
        }
    }

  }
}


function loadPreviewPhoto(){
      var src = document.getElementById("userInputFile");
      var target = document.getElementById("user-image");
      var fr = new FileReader();
      fr.readAsDataURL(src.files[0]);
      fr.onload = function(e){
        target.src = this.result;
      };
}

function createNews(news){
	$("#news").prepend(feedback(news.title,news.desc,news.image));
}

function show(){
  	if(useLocalStorage){
		var news = new Array;
	    var news_item = localStorage.getItem('news');
	    if (news_item !== null) {
	        news = JSON.parse(news_item);
	    }
	    if ((typeof news !== 'undefined') && (news.length > 0)) {
		    for(var i = 0; i < news.length; i++) {
	    		createNews(news[i]);
		    }
		}
  
	}else{
		var openDB = indexedDB.open("news", 1);
		openDB.onupgradeneeded = function(){
		    var db = openDB.result;
		    var store = db.createObjectStore("news", {keyPath: "title"});
		    store.createIndex("title", "title", {unique: false});
		    store.createIndex("desc", "desc", {unique: false});
		    store.createIndex("image", "image", {unique: false});
		}
		openDB.onsuccess = function(event){
		    var db = openDB.result;
		    var trans = db.transaction("news", "readwrite");
		    var store = trans.objectStore("news");
		    store.openCursor().onsuccess = function(event){
		       	var cursor = event.target.result;
		       	if (cursor){
		         	var tempNews = new News (cursor.value.title, cursor.value.desc, cursor.value.image);
		         	createNews(tempNews);
		         	//var request = db.transaction(["news"], "readwrite").objectStore("news").delete(cursor.primaryKey);
		         	cursor.continue();
		       	}
		   	};
			trans.oncomplete = function(){
		    	db.close();
			}
		}
	}
}

show();