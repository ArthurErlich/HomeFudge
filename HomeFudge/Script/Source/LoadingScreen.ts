namespace HomeFudge {
    export class LoadingScreen {

        private static body: HTMLElement;
        private static loadText: HTMLElement;
        private static loadPNG:HTMLElement;
        public static init(canvas: HTMLCanvasElement) {
            canvas.style.backgroundColor = "#191919";
            LoadingScreen.body = document.body;
            LoadingScreen.loadText = document.createElement("div");
            LoadingScreen.loadPNG = document.createElement("div");

            LoadingScreen.loadText.style.fontSize = "44px";
            LoadingScreen.loadText.style.textAlign  = "center";
            LoadingScreen.loadText.style.width  = "420px";
            LoadingScreen.loadText.innerHTML = "HomeFudge is Loading";
            LoadingScreen.loadText.style.position = "fixed"
            LoadingScreen.loadText.style.left = "0";
            LoadingScreen.loadText.style.bottom = "0";
            LoadingScreen.loadText.style.color = "#e8e8e8";

            LoadingScreen.loadPNG = document.createElement("div");
            LoadingScreen.loadPNG.style.width="100px";
            LoadingScreen.loadPNG.style.height="100px";
            LoadingScreen.loadPNG.style.position = "fixed"
            LoadingScreen.loadPNG.style.right = "0";
            LoadingScreen.loadPNG.style.bottom = "0";

            let img = document.getElementById("loadingIMG");
            img.hidden = false;
            LoadingScreen.loadPNG.style.backgroundColor = "#e8e8e8 "
            LoadingScreen.loadPNG.append(img);
            LoadingScreen.body.append(LoadingScreen.loadText);
            LoadingScreen.body.append(LoadingScreen.loadPNG);

        }
        public static remove() {
            LoadingScreen.loadText.remove();
            LoadingScreen.loadPNG.remove();
        }

    }

}