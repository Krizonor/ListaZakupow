import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Rozpoczynam seedowanie danych...');

    const rodzina = await prisma.Rodzina.create({
        data: {
            nazwa: 'Rodzina Kowalskich',
        },
    });

    const uzytkownik = await prisma.Uzytkownik.create({
        data: {
            imie: 'Jan',
            email: 'jan@kowalski.pl',
        },
    });

    await prisma.CzlonkowieRodziny.create({
        data: {
            rodzina_id: rodzina.id,
            uzytkownik_id: uzytkownik.id,
        },
    });

    const lista = await prisma.ListaZakupow.create({
        data: {
            nazwa: 'Zakupy na weekend',
            wlasciciel_id: uzytkownik.id,
            rodzina_id: rodzina.id,
        },
    });

    const kategoria = await prisma.Kategoria.create({
        data: {
            nazwa: 'Nabiał',
        },
    });

    await prisma.Produkt.create({
        data: {
            nazwa: 'Mleko 2%',
            lista_id: lista.id,
            kategoria_id: kategoria.id,
            ilosc: 2,
            jednostka: 'szt',
        },
    });

    console.log('Baza danych zostala uzupelniona.');
}

main()
    .catch((e) => {
        console.error('Blad podczas seedowania:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });