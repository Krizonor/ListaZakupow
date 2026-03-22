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

app.post("/uzytkownicy", async (req, res) => {
  const { imie, email, url_zdjecia_profilowego } = req.body;
  try {
    const nowyUzytkownik = await prisma.Uzytkownik.create({
      data: {
        imie,
        email,
        url_zdjecia_profilowego: url_zdjecia_profilowego || null
      },
    });
    res.json(nowyUzytkownik);
  } catch (err) {
    console.error(err);
    if (err.code === 'P2002') {
      return res.status(400).json({ error: "Ten email jest juz zajety" });
    }
    res.status(500).json({ error: "Blad podczas tworzenia uzytkownika" });
  }
});

app.post("/produkty", async (req, res) => {
  const { nazwa, lista_id, kategoria_id, ilosc, jednostka } = req.body;
  try {
    const nowyProdukt = await prisma.Produkt.create({
      data: {
        nazwa,
        lista_id: parseInt(lista_id),
        kategoria_id: kategoria_id ? parseInt(kategoria_id) : null,
        ilosc: parseFloat(ilosc) || 1,
        jednostka: jednostka || "szt",
        kupione: false
      },
    });
    res.json(nowyProdukt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Blad podczas dodawania produktu" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Serwer dziala na porcie ${PORT}`));