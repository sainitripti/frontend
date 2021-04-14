window.onload = init;

function init()
{
    document.getElementById("load-segmentation-result-button").addEventListener('click', add);
}
function add()
{
    const url = "http://localhost:5000/";
    const http = new XMLHttpRequest();
    http.open("GET", url);
    http.send();
    http.onreadystatechange=(e)=> {
        console.log(http.responseText)
    }
}


