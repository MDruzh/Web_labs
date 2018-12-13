//   const namearea = document.getElementById('name');
//   const textarea = document.getElementById('text');
//   const feedbackContainer = document.getElementById('hf');
//   const form = document.getElementById('form');

// const feedbackArea = (name, text, date, time) => ` 
//     <div class="container">
//         <br>
//         <p>
//         <br>
//         ${text}
//         </p>
//         <br>
//         <span class="review-date">${date}, ${time}</span>
//         <span class="review-author" style="margin-left: 80%">${name}</span>
//     </div>
//     <div class="divider"></div>
// `

// function complete(){
//   const date = new Date();
//   if(textarea.value.length == ""){
//     alert('All field must be completed');
//     return false;
//   }else if(namearea.value.length == ""){
//     alert("All field must be completed")
//     return false;
//   }else if(textarea.value.length > 0 ){
//     $('#hf').prepend(
//     feedbackArea(namearea.value, textarea.value, date.toLocaleDateString(), date.toLocaleTimeString()));
//   }
//   textarea.value="";
//   namearea.value="";

// }






var useLocalStorage = false;
window.isOnline = () => this.navigator.onLine;

const feedbackArea = (name, text, date, time) => ` 
    <div class="container">
        <br>
        <p>
        <br>
        ${text}
        </p>
        <br>
        <span class="review-date">${date}, ${time}</span>
        <span class="review-author" style="margin-left: 80%">${name}</span>
    </div>
    <div class="divider"></div>
`

class Feedback{
  constructor(name, text, date){
    this.name = name;
    this.text = text;
    this.date = date;
  }
}

function addToStorage(feedback){
  if(useLocalStorage){
      var feedbackItem = localStorage.getItem('feedbacks');
      if (feedbackItem !== null) {
          feedbacks = JSON.parse(feedbackItem);
        }
    feedbacks.push(feedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    return false;
  }
  else{
    var openDB = indexedDB.open("feedback", 1);

    openDB.onerror = function(event){
      alert("Error when adding feedback to DataBase")
    };
    openDB.onsuccess = function(event){
      var db = openDB.result;
      var trans = db.transaction(["feedbacks"], "readwrite");
      var store = trans.objectStore("feedbacks");
      var addFeedback = store.put(feedback);
      addFeedback.onsuccess = function(event){
        alert("Feedback added");
      }
      addFeedback.onerror = function(event){
        alert("Error when adding Feedback")
      }
      trans.oncomplete = function(){
        db.close();
      }
    };
  }
}


function show() {
   if (isOnline()){
    if(useLocalStorage){
        var feedbackItem = localStorage.getItem('feedbacks');
        if (feedbackItem !== null) {
            feedbacks = JSON.parse(feedbackItem);
          }
      if ((typeof feedbacks !== 'undefined') && (feedbacks.length > 0)) {
        for(var i = 0; i < feedbacks.length; i++) {
          createFeedback(feedbacks[i]);
        }
      }
    }
    else if (!isOnline()) return; 
    else{
        var openDB = indexedDB.open("feedback", 1);
        openDB.onupgradeneeded = function() {
          var db = openDB.result;
          var store = db.createObjectStore("feedbacks", {keyPath: "name"});
          store.createIndex("name", "name", {unique: false});
          store.createIndex("text", "text", {unique: false});
          store.createIndex("date", "date", {unique: false});
        }
        openDB.onsuccess = function(event){
          var db = openDB.result;
          var trans = db.transaction("feedbacks", "readwrite");
          var store = trans.objectStore("feedbacks");
          store.openCursor().onsuccess = function(event){
            var cursor = event.target.result;
            if (cursor) {
              var tempFeed = new Feedback(cursor.value.name, cursor.value.text, cursor.value.date);
              createFeedback(tempFeed);
              //var request = db.transaction(["feedbacks"], "readwrite").objectStore("feedbacks").delete(cursor.primaryKey);
              cursor.continue();
          }
        }
        trans.oncomplete = function(){
          db.close();
        }
      }
    }
  }else{
  return;
}
}

function complete(){
  var comment = document.getElementById("text");
  var name = document.getElementById("name");
  var date = new Date();
  dateString = date.toLocaleDateString()+ ", " + date.toLocaleTimeString();
  if(name.value == ""){
    alert("Введіть ім'я!");
    return;
  }
  if(comment.value == ""){
    alert("Введіть відгук!");
    return;
  }
  var feedback = new Feedback(name.value, comment.value, dateString);
  addToStorage(feedback);
  createFeedback(feedback);
  name.value = "";
  text.value = "";
}


function createFeedback(feedback){
  $("#container").prepend(feedbackArea(feedback.name,feedback.text,feedback.date));
}
show();