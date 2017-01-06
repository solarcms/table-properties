export default function getMeta(metaName){
    var x = document.getElementsByTagName("META");
    var txt = "";
    var i;
    for (i = 0; i < x.length; i++) {
        if (x[i].name==metaName)
        {
            return (x[i].content);
        }

    }
}