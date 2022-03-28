// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

const event = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {

  if (req.method === "GET") {
    const events = (await prisma.historicalEvent.findMany({ orderBy: { date: "asc" } }))
    res.status(200).json(events.map(item => ({...item, date: item.date.toISOString().slice(0, 10).split("-")})))
  }

  else if (req.method === "POST") {

    const { name, description, date, monthPresent, datePresent } = req.query as Record<string, string>;

    if (!name || !date) {
      res.status(400);
      return;
    }

    try {
      await prisma.historicalEvent.create({
        data: {
          name: name,
          description: description || "",
          date: new Date(date),
          monthPresent: monthPresent == "true",
          datePresent: datePresent == "true"
        }
      })
    }
    catch (err) {
      res.status(400).send(err);
    }

    const events = (await prisma.historicalEvent.findMany({ orderBy: { date: "asc" } }));
    res.status(200).json(events.map(item => ({...item, date: item.date.toISOString().slice(0, 10).split("-")})))
  }

  else if (req.method === "PUT") {

    const { id, name, description, date, monthPresent, datePresent } = req.query as Record<string, string>;

    if (!id) {
      res.status(400);
      return;
    }

    try {
      await prisma.historicalEvent.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          description: description || "",
          date: new Date(date),
          monthPresent: monthPresent == "true",
          datePresent: datePresent == "true"
        }
      })
    }
    catch (err) {
      res.status(400).send(err);
      return;
    }

    const events = (await prisma.historicalEvent.findMany({ orderBy: { date: "asc" } }));
    res.status(200).json(events.map(item => ({...item, date: item.date.toISOString().slice(0, 10).split("-")})))
  }
  else if (req.method === "DELETE") {

    const { id } = req.query as Record<string, string>;

    if (!id) {
      res.status(400);
      return;
    }

    try {
      await prisma.historicalEvent.delete({
        where: {
          id: id,
        }
      })
    }
    catch (err) {
      res.status(400).send(err);
    }

    const events = (await prisma.historicalEvent.findMany({ orderBy: { date: "asc" } }));
    res.status(200).json(events.map(item => ({...item, date: item.date.toISOString().slice(0, 10).split("-")})))
  }
}

export default event;