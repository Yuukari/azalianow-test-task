const successHint = document.querySelector(".successHint");

if (successHint != null)
    setTimeout(() => {
        successHint.remove();
    }, 3000);