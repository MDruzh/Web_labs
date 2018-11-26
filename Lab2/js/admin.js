const title = document.getElementById('title');
const news = document.getElementById('news');

function addingNews(){
  if(title.value.length > 0 && news.value.length > 0){
    alert("News succefully added");
  }else{
    alert("All fields should be completed");
  }
  title.value="";
  news.value="";
}