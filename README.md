# Mira

<div align="center">
  <img src="./docs/static/mira-banner.jpg" alt="Mira Banner" width="100%" />
</div>

<div align="center">

📖 [Documentation](./docs/README.md) | 📄 [Litepaper](#)

</div>

# Installation

## Requirements
- `docker`
- `docker-compose`
- `node`
- `npm`

## Clone the repository

```bash
git clone https://github.com/paoloanzn/mira.git
cd mira
git checkout main
```

## Install

```bash
npm i
```

## Create .env file

```bash
cp .env.example .env
```
Edit the `.env` file.


## Run Mira System

```bash
npx mira-cli start
```

## Run Migrations

```bash
npx mira-cli migrate
```
