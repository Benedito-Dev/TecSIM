# ⚙️ TecSim

**TecSim** é uma aplicação full stack composta por frontend e backend, desenvolvida para gerenciar e simular dados técnicos de forma simples e eficiente. Este repositório contém todos os arquivos necessários para executar o projeto localmente.

Para começar, clone o repositório com o comando `git clone` e, em seguida, acesse a pasta clonada com `cd tec-sim`. O projeto está dividido em duas partes: o backend e o frontend. A instalação das dependências deve ser feita separadamente para cada um deles. No terminal, navegue até a pasta `backend` e execute `npm install`. Em seguida, vá para a pasta `frontend` e repita o processo com `npm install`.

Antes de iniciar a aplicação, é importante configurar corretamente os IPs de requisição para garantir que o frontend consiga se comunicar com o backend. Para isso, abra o arquivo `frontend/api/api.js` e altere o endereço base da API para o IP da máquina onde o backend estará rodando. Além disso, atualize também os seguintes arquivos e linhas específicas: `Profile.jsx` na linha 29 e `Edit-Profile.jsx` na linha 41, ambos localizados em `frontend/src/pages/`.

Com as dependências instaladas e os IPs configurados, você pode iniciar o projeto. Para isso, execute `npm start` dentro da pasta `backend` para iniciar o servidor, e depois `npm start` na pasta `frontend` para abrir a interface do sistema. A aplicação deverá estar acessível no navegador pelo endereço correspondente ao frontend, geralmente `http://localhost:3000` ou pelo IP da máquina configurado anteriormente.

O TecSim utiliza tecnologias como React.js no frontend e Node.js com Express no backend, oferecendo uma base sólida e moderna para desenvolvimento e manutenção.

Em caso de dúvidas ou sugestões, sinta-se à vontade para abrir uma issue neste repositório. Colabore, explore e ajude a tornar o **TecSim** ainda melhor. 🚀
