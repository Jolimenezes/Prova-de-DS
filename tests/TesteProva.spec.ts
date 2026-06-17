import { test, expect } from '@playwright/test';

const MEU_RM = '251166';
const BASE_URL = 'https://prova.carvalho.cc/';

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
  await page.getByLabel('URL do Repositório').fill("https://github.com/Jolimenezes/Prova-de-DS");
  await page.getByRole('button', { name: 'Iniciar Prova' }).click();

  for (let i = 1; i <= 16; i++) {
    await expect(page.locator(`text=/Pergunta ${i} de 16/`)).toBeVisible();

    let respostaCorreta = "";
    
    switch (i) {
      case 1:
        respostaCorreta = "Executa uma função de configuração antes de cada caso de teste individualmente";
        break;
      case 2:
        respostaCorreta = "Para manter o teste rápido e determinístico, sem depender de um serviço externo";
        break;
      case 3:
        respostaCorreta = "Uma função que valida os dados de entrada, salva no banco de dados e envia um e-mail";
        break;
      case 4:
        respostaCorreta = "Uma tupla com o valor atual do estado e uma função de atualização";
        break;
      case 5:
        respostaCorreta = "Os testes devem ser simples e legíveis — evite complexidade desnecessária";
        break;
      case 6:
        respostaCorreta = "Porque são os mais caros de escrever, executar e manter";
        break;
      case 7:
        respostaCorreta = "Um conjunto de casos de teste agrupados em torno de uma funcionalidade ou preocupação";
        break;
      case 8:
        respostaCorreta = "Testa um único trecho de lógica de forma isolada, sem dependências externas";
        break;
      case 9:
        respostaCorreta = "Testes unitários";
        break;
      case 10:
        respostaCorreta = "Incluir na lista de dependências um valor que é reatribuído dentro do próprio efeito";
        break;
      case 11:
        respostaCorreta = "Os serviços podem ser implantados, escalados e desenvolvidos de forma independente";
        break;
      case 12:
        respostaCorreta = "Executar um efeito colateral (ex: buscar dados, configurar uma inscrição) após a renderização";
        break;
      case 13:
        respostaCorreta = "A porcentagem do código de produção executada pela suite de testes";
        break;
      case 14:
        respostaCorreta = "Don't Repeat Yourself — evite duplicar conhecimento ou lógica";
        break;
      case 15:
        respostaCorreta = "Teste de integração";
        break;
      case 16:
        respostaCorreta = "Quantas vezes a função foi chamada e com quais argumentos";
        break;

    }

    await page.getByText(respostaCorreta, { exact: true }).click();

    const nomeBotaoAvancar = (i === 16) ? 'Enviar' : 'Próxima'; 
    await page.getByRole('button', { name: nomeBotaoAvancar, exact: true }).click();
  }

  await expect(page.getByRole('heading', { name: 'Prova enviada!' })).toBeVisible();
});

