  const namearea = document.getElementById('name');
  const textarea = document.getElementById('text');
  const feedbackContainer = document.getElementById('hf');
  const form = document.getElementById('form');

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

function complete(){
  const date = new Date();
  if(textarea.value.length == ""){
    alert('All field must be completed');
    return false;
  }else if(namearea.value.length == ""){
    alert("All field must be completed")
    return false;
  }else if(textarea.value.length > 0 ){
    $('#hf').prepend(
    feedbackArea(namearea.value, textarea.value, date.toLocaleDateString(), date.toLocaleTimeString()));
  }
  textarea.value="";
  namearea.value="";

}