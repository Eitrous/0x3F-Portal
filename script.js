const form = document.querySelector("#cmd-form");
const input = document.querySelector("#cmd-input");
const output = document.querySelector("#cmd-output");

const availableCommands = ["cat", "cd", "ls", "help"];

const views = {
  "cat profile": `
        <header>
          <div>
            <div class="title">0x3F</div>
            <!-- <pre class="ascii-title">
  ██████╗ ██╗  ██╗██████╗ ███████╗
 ██╔═████╗╚██╗██╔╝╚════██╗██╔════╝
 ██║██╔██║ ╚███╔╝  █████╔╝█████╗  
 ████╔╝██║ ██╔██╗  ╚═══██╗██╔══╝  
 ╚██████╔╝██╔╝ ██╗██████╔╝██║     
  ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝     
              </pre> -->
            <p class="subtitle">Eitrous's Personal Portal</p>
          </div>
        </header>

        <main class="profile">
          <div>
            <section>
              <h2>About</h2>
              <p>这是我的个人主页</p>
            </section>

            <section>
              <h2>Projects</h2>
              <a
                class="project"
                href="https://fumo.touhouspots.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div class="project-title">01 / Fumo Spots</div>
                <div class="project-desc">Share your Fumo posts.</div>
              </a>
            </section>
          </div>

          <div>
            <section>
              <h2>Profile</h2>
              <table class="profile-table">
                <tr>
                  <td>Name</td>
                  <td>
                    <div>Eitrous \\</div>
                    <div>GSTRenko \\</div>
                    <div>汎用合成型宇佐見05</div>
                  </td>
                </tr>
                <tr>
                  <td>University</td>
                  <td>GSAI</td>
                </tr>
                <tr>
                  <td>Location</td>
                  <td>Gensokyo</td>
                </tr>
              </table>
            </section>

            <section>
              <h2>Links</h2>
              <div class="links">
                <a class="link-button" href="https://blog.0x3f.io">Weblog</a>
                <a class="link-button" href="mailto:me@0x3f.io">Email</a>
                <a class="link-button" href="https://github.com/Eitrous"
                  >GitHub</a
                >
              </div>
            </section>
          </div>
        </main>
        <footer>
          <span>Last update: 2026-05-31</span>
          <svg class="barcode" id="barcode"></svg>
        </footer>
`,

  ls: `
    <section class="output ls">
    <h2>Directory</h2>
    <div class="dir-list">
    <p>keys</p>
    <p>links</p>
    <p>profile</p>
    <p>projects</p>
    <p class="dir">secret</p>
    </div>
    </section>
`,

  "cat projects": `
    <section class="output">
    <h2>Projects</h2>
    <a class="project" href="https://fumo.touhouspots.com" target="_blank" rel="noopener noreferrer">
        <div class="project-title">01 / Fumo Spots</div>
        <div class="project-desc">Share your Fumo posts.</div>
    </a>
    </section>
`,

  "cat links": `
    <section class="output">
    <h2>Links</h2>
    <div class="links">
        <a class="link-button" href="https://blog.0x3f.io">Weblog</a>
        <a class="link-button" href="mailto:me@0x3f.io">Email</a>
        <a class="link-button" href="https://github.com/Eitrous">GitHub</a>
    </div>
    </section>
`,

  "cat keys": `
    <section class="output">
    <h2>Keys</h2>
    <details>
    <summary>SSH</summary>
    <div class="key-desc">
    <p>ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIB+p+ELjvkcGyE5dzeV8jonHya/+6ws6L7f8ASDxN/HU @eitrous</p>
    or
    <p>
    <code>curl https://ssh-key.0x3f.io/ >> ~/.ssh/authorized_keys</code>
    </p>
    </div>
    </details>
    </section>
`,

  help: `
    <section class="output help">
    <h2>Help</h2>
    <p>Available commands:</p>
    <div class="cmd-list">
    <p>cat</p>
    <p>cd</p>
    <p>ls</p>
    <p>help</p>
    </div>
    </section>
`,
};

function renderBarcode() {
  const barcodeEl = document.querySelector("#barcode");
  // 必须确保当前 DOM 里有这个元素再进行渲染，否则 JsBarcode 会报错
  if (barcodeEl) {
    JsBarcode("#barcode", "0x3f.io", {
      format: "CODE128",
      lineColor: "#000",
      background: "transparent",
      width: 2,
      height: 20,
      displayValue: false,
      padding: 0,
      margin: 0,
    });
  }
}

renderBarcode();

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    form.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true }),
    );
  }
});

form.addEventListener("click", function () {
  input.focus(); // 聚焦到输入框
  
  // 对于 contenteditable 元素，聚焦后光标可能会跑到最前面，我们需要强制把它移到文字最后
  if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
    const range = document.createRange();
    range.selectNodeContents(input);
    range.collapse(false); // false 表示折叠到文本末尾
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const inputArr = input.textContent.trim().toLowerCase().split(" ");
  const command = inputArr[0];
  const args = inputArr.slice(1);

  // if (views[command]) {
  //   output.innerHTML = views[command];
  // } else {
  //   output.innerHTML = `
  //   <section>
  //       <h2>Error</h2>
  //       <p>${command}: permission denied</p>
  //       <p>Type "help" to see other available commands.</p>
  //   </section>
  //   `;
  // }
  if (command === "") {
    return;
  }

  if (!availableCommands.includes(command)) {
    output.innerHTML = `
    <section class="output">
        <h2>Error</h2>
        <p>${command}: Permission denied</p>
        <p>Type "help" to see other available commands.</p>
    </section>
    `;
  }

  if (command === "cat") {
    const target = args[0];
    if (args.length !== 1) {
      output.innerHTML = `
      <section class="output">
          <h2>Error</h2>
          <p>Usage: cat [target]</p>
      </section>
      `;
    } else if (views[`${command} ${target}`]) {
      output.innerHTML = views[`${command} ${target}`];
    } else {
      output.innerHTML = `
      <section class="output">
          <h2>Error</h2>
          <p>${command}: ${target}: No such file or directory</p>
      </section>
      `;
    }
  } else if (command === "ls") {
    output.innerHTML = views.ls;
  } else if (command === "help") {
    output.innerHTML = views.help;
  } else if (command === "cd") {
    if (args.length !== 1) {
      output.innerHTML = `
      <section class="output">
          <h2>Error</h2>
          <p>Usage: cd [target]</p>
      </section>
      `;
    } else if (args[0] === "secret") {
      output.innerHTML = `
      <section class="output">
          <h2>Error</h2>
          <p>cd: secret: Permission denied</p>
      </section>
      `;
    } else {
      output.innerHTML = `
      <section class="output">
          <h2>Error</h2>
          <p>cd: ${args[0]}: No such file or directory</p>
      </section>
      `;
    }
  }
  input.textContent = "";
  renderBarcode();
});
