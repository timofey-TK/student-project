tel = "8 (999) 999-99-99"
link = ""
if (tel[0] == "8") {
    link = "7" + (tel.replace(/[\s\(\)\+\-8]/g, ""));
}
else {
    link = (tel.replace(/[\s\(\)\+\-]/g, ""));
}

console.log(tel);
