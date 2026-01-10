import qrCode from "qrcode-terminal";

(async function main() {
  for (let i = 0; i < 20; i++) {
    try {
      console.log("checking http://localhost:4040/api/tunnels ...");

      const res = await fetch("http://localhost:4040/api/tunnels");
      const body = await res.json();
      const url = body.tunnels[0].public_url;

      console.log(url);
      qrCode.generate(url);

      return;
    } catch (e) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
})();
