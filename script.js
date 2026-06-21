function toggleTheme(){
document.body.classList.toggle("light");
}

// Save progress (basic system)
function saveProgress(subject){
localStorage.setItem(subject,"completed");
alert(subject + " marked as completed!");
}