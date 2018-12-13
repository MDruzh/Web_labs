var useLocalStorage = false;
window.isOnline = () => this.navigator.onLine;

const ZMI = (title, text,photo) => ` 
      <div class="col-lg-3" style="margin-left: 5%;">
    <img src=${photo} style="height:300px; width: 400px; margin-top: 3%;">
    <div style="width: 400px; height: 90px; border: 2px solid blue; margin-top: 2%">
    <h1 style="text-align: center;">${title}</h1>
    </div>
    <div style="width: 400px; height: 400px; border: 2px solid blue; margin-top: 2%">
    <p style="padding-left: 2%; padding-top: 2%; padding-right: 2%; font-size: 21px;">${text}</p>
    </div>
  </div>
`

class News{
  constructor(title, text, photo){
    this.title = title;
    this.text = text;
    this.photo = photo;
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

function adding(){
  
  var imageForm = document.getElementById("EnterFile");
  var title = document.getElementById("Title");
  var text = document.getElementById("NewsField");
  var photo = document.getElementById("Test");
  if (title.value == ""){
    alert("Введіть заголовок!");
    return;
  }
  if (text.value == ""){
    alert("Введіть опис статті!");
    return;
  }
  var news = new News(title.value, text.value, photo.src);
  addToStorage(news);
  title.value = "";
  text.value = "";
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
        store.createIndex("text", "text", {unique: false});
        store.createIndex("photo", "photo", {unique: false});
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
      var src = document.getElementById("EnterFile");
      var target = document.getElementById("");
      var fr = new FileReader();
      fr.readAsDataURL(src.files[0]);
      fr.onload = function(e){
        target.src = this.result;
      };
}

function createNews(news){
  $("#News").prepend(ZMI(news.title,news.text,news.photo));
}

function show(){
  if(isOnline()){
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
        store.createIndex("text", "text", {unique: false});
        store.createIndex("photo", "photo", {unique: false});
      }
      openDB.onsuccess = function(event){
        var db = openDB.result;
        var trans = db.transaction("news", "readwrite");
        var store = trans.objectStore("news");
        store.openCursor().onsuccess = function(event){
            var cursor = event.target.result;
            if (cursor){
              var tempNews = new News (cursor.value.text, cursor.value.title, cursor.value.photo);
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
  else{
    return;
  }
}

show();