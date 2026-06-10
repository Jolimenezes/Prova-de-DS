import { test, expect } from '@playwright/test';

const MEU_RM = '251166';
const BASE_URL = 'https://carvalho.cc';

const GABARITO: Record<string, string> = {
  "Qual é o propósito do beforeEach": "Executa uma função de configuração antes de cada caso de teste individualmente",
  "pergunta_2_aqui": "Texto exato da alternativa correta 2",
  "pergunta_3_aqui": "Texto exato da alternativa correta 3",
};

test('submissão completa da prova', async ({ browser }) => {
  const context = await browser.newContext({
    extraHTTPHeaders: { 'x-exam-student-id': MEU_RM },
  });
  const page = await context.newPage();

  await page.goto(BASE_URL);

  // Dry-run banner should NOT appear
  await expect(page.locator('#dry-run-banner')).not.toBeVisible();

  await page.getByLabel('Número de Matrícula').fill(MEU_RM);
  await page.getByLabel('Nome Completo').fill("Jônatas Menezes");
  await page.getByLabel('URL do Repositório').fill("https://github.com");
  await page.getByRole('button', { name: 'Iniciar Prova' }).click();

  for (let i = 1; i <= 16; i++) {
    await expect(page.locator('text=/Pergunta ' + i + ' de 16/')).toBeVisible();

    const enunciadoElement = page.locator('h3, p, div').filter({ hasText: 'propósito' }).first(); // Ajuste o seletor conforme a tag real da pergunta
    const textoEnunciado = await enunciadoElement.innerText();

    let respostaCorreta = "";
    for (const [chavePergunta, valorResposta] of Object.entries(GABARITO)) {
      if (textoEnunciado.includes(chavePergunta)) {
        respostaCorreta = valorResposta;
        break;
      }
    }

    if (!respostaCorreta) {
      throw new Error(`Não foi encontrada uma resposta no gabarito para a pergunta: "${textoEnunciado}"`);
    }

    await page.getByText(respostaCorreta, { exact: true }).click();

    const nomeBotaoAvancar = (i === 16) ? 'Finalizar' : 'Próxima'; 
    await page.getByRole('button', { name: nomeBotaoAvancar, exact: true }).click();
  }

  await expect(page.getByRole('heading', { name: 'Prova enviada!' })).toBeVisible();
});

