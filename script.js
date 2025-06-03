  const input = document.getElementById('expression');
  const resultDiv = document.getElementById('result');
  const historyList = document.getElementById('historyList');
  let lastResult = 0;

  document.querySelectorAll('.btn').forEach(button => {
    if (!button.hasAttribute('onclick')) {
      button.addEventListener('click', () => {
        const val = button.innerText;
        if (val === 'π') input.value += 'Math.PI';
        else if (val === 'e') input.value += 'Math.E';
        else input.value += val;
        calculate();
      });
    }
  });

  input.addEventListener('input', calculate);

  function clearInput() {
    input.value = '';
    resultDiv.textContent = 'Result: ';
  }

  function backspace() {
    input.value = input.value.slice(0, -1);
    calculate();
  }

  function useAns() {
    input.value += lastResult;
    calculate();
  }

  function calculate() {
    let expr = input.value;
    try {
      expr = expr.replace(/\^/g, '**');
      const func = new Function('return ' + expr
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
      );
      const result = func();
      if (!isNaN(result)) {
        lastResult = result;
        resultDiv.textContent = 'Result: ' + result;
        updateHistory(expr, result);
      }
    } catch (e) {
      resultDiv.textContent = '';
    }
  }

  function updateHistory(expression, result) {
    const item = document.createElement('li');
    item.textContent = `${expression} = ${result}`;
    historyList.prepend(item);
    if (historyList.children.length > 10) {
      historyList.removeChild(historyList.lastChild);
    }
  }

  function toggleDarkMode() {
    document.body.classList.toggle('dark');
  }
  function exportHistoryPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Calculator History", 10, 10);

  const items = Array.from(historyList.children).map((li, i) =>
    `${i + 1}. ${li.textContent}`
  );

  let y = 20;
  items.forEach(item => {
    doc.text(item, 10, y);
    y += 10;
  });

  doc.save("calculator_history.pdf");
}

function exportHistoryText() {
  const items = Array.from(historyList.children).map(li => li.textContent);
  const blob = new Blob([items.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "calculator_history.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

