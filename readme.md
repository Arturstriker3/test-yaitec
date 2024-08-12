# Teste YAITEC
 
 Nesse projeto o foco foi desenvolver uma aplicação fullstack que permite armazenar livros num sistema com autenticação JWT e executar um RAG sobre o pdf daquele livro, trazendo informações relevantes sobre ele.

## Clonar Repositório
```
git clone https://github.com/Arturstriker3/test-yaitec
```

## Abrir o repositório
```
cd .\test-yaitec\ 
```

## Primeiro com Docker e Docker Composer instalado execute o .yml para rodar o container do banco de dados
```
npm run start:db
```

## Instalar dependências do back e front
```
npm run install:full
```

## Compilar e rodar todo projeto
```
npm run start
```

## Portas que o projeto usa

O projeto usa por padrão essas portas, caso já estejam usadas recomendo trocar elas.
```
DB = 5432
Backend = 5050
Frontend = 5173
```

### Necessidades do projeto

 O banco de dados usado foi o postgreSql rodando em um container docker. Para isso é necessário ter o docker instalado na máquina e o docker composer para executar o comando que rodar o banco de dados e o pgAdmin para melhor controle e visualização do mesmo.

 Na pasta "back", encontra-se o .env com informações para rodar localmente na máquina. Se faz necessário colocar a OPENAI_API_KEY para a funcionalidade de RAG ocorrer.
