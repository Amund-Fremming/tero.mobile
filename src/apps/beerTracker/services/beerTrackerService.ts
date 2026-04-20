import { PLATFORM_URL_BASE } from "@/src/core/config/api";
import { err, ok, Result } from "@/src/core/utils/result";
import axios from "axios";
import { BeerTrackerGame } from "../constants/beerTrackerTypes";

const BASE = `${PLATFORM_URL_BASE}/beer-tracker`;

export async function createGame(canSize: number, goal: number | null): Promise<Result<BeerTrackerGame>> {
  try {
    const res = await axios.post<BeerTrackerGame>(BASE, { can_size: canSize, goal });
    return ok(res.data);
  } catch (e) {
    console.error("createGame:", e);
    return err("Klarte ikke opprette spill");
  }
}

export async function getGame(id: string): Promise<Result<BeerTrackerGame>> {
  try {
    const res = await axios.get<BeerTrackerGame>(`${BASE}/${id}`);
    return ok(res.data);
  } catch (e) {
    console.error("getGame:", e);
    return err("Klarte ikke hente spill");
  }
}

export async function joinGame(id: string, name: string): Promise<Result<BeerTrackerGame>> {
  try {
    const res = await axios.post<BeerTrackerGame>(`${BASE}/${id}/join`, { name });
    return ok(res.data);
  } catch (e) {
    console.error("joinGame:", e);
    return err("Klarte ikke bli med");
  }
}

export async function incrementBeer(id: string, name: string, canSize: number): Promise<Result<BeerTrackerGame>> {
  try {
    const res = await axios.post<BeerTrackerGame>(`${BASE}/${id}/increment`, { name, can_size: canSize });
    return ok(res.data);
  } catch (e) {
    console.error("incrementBeer:", e);
    return err("Klarte ikke registrere øl");
  }
}

export async function leaveGame(id: string, name: string): Promise<Result> {
  try {
    await axios.post(`${BASE}/${id}/leave`, { name });
    return ok();
  } catch (e) {
    console.error("leaveGame:", e);
    return err("Klarte ikke forlate spill");
  }
}

export async function finishGame(id: string): Promise<Result> {
  try {
    await axios.post(`${BASE}/${id}/finish`);
    return ok();
  } catch (e) {
    console.error("finishGame:", e);
    return err("Klarte ikke avslutte spill");
  }
}
