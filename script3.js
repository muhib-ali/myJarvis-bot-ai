// document.addEventListener('DOMContentLoaded', (event) => {
//     const toggleButton = document.getElementById('image-toggle');
    
//     // Check local storage for the toggle state and set the checkbox accordingly
//     const toggleState = localStorage.getItem('toggleState');
//     if (toggleState === 'on') {
//         toggleButton.checked = true;
//     } else {
//         toggleButton.checked = false;
//     }
    
//     // Add event listener to the checkbox
//     toggleButton.addEventListener('change', function() {
//         if (this.checked) {
//             localStorage.setItem('toggleState', 'on');
//             window.location.href = './imageai.html'; // URL to navigate to when toggled on
//         } else {
//             localStorage.setItem('toggleState', 'off');
//             window.location.href = './index3.html'; // URL to navigate to when toggled off
//         }
//     });

// });