const alertDismiss = document.getElementById("alert-dismissible");
const alertDismissButton = document.getElementById("alert-dismiss");
if (alertDismissButton != null && alertDismiss != null)
{
    alertDismissButton.addEventListener("click", () => closeAlert())
    function closeAlert() {
        console.log("Alert Cancel Button Clicked!");
        setTimeout(() => {
            alertDismiss.style.display = "none";
        }, 100);
    }
}