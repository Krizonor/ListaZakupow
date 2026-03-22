import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/uzytkownicy", async (req, res) => {
    try {
        const dane = await prisma.Uzytkownik.findMany();
        res.json(dane);
    } catch (err) {
        res.status(500).json({ error: "Blad serwera" });
    }
});

app.get("/rodziny", async (req, res) => {
    try {
        const dane = await prisma.Rodzina.findMany();
        res.json(dane);
    } catch (err) {
        res.status(500).json({ error: "Blad serwera" });
    }
});

app.get("/listy", async (req, res) => {
    try {
        const dane = await prisma.ListaZakupow.findMany();
        res.json(dane);
    } catch (err) {
        res.status(500).json({ error: "Blad serwera" });
    }
});

app.get("/produkty", async (req, res) => {
    try {
        const dane = await prisma.Produkt.findMany();
        res.json(dane);
    } catch (err) {
        res.status(500).json({ error: "Blad serwera" });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Serwer dziala na porcie ${PORT}`));