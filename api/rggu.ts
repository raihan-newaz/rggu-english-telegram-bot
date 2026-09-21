const API = "https://raspis.rggu.ru/api/";

async function post<T>(path: string, body?: URLSearchParams): Promise<T> {
  const response = await fetch(API + path, { method: "POST", body, headers: body ? { "content-type": "application/x-www-form-urlencoded" } : undefined });
  if (!response.ok) throw new Error(`RGGU API ${path}: ${response.status}`);
  return response.json() as Promise<T>;
}

export type Flow = { id: string; direction: string; profile: string; data: string };
export type ScheduleFlow = { subject: string; teacher_fullfio?: string; teacher?: string; room?: string; lessontype?: string; group?: string };
export type SchedulePair = { pair: number; flows: ScheduleFlow[] };
export type ScheduleDay = { date: string; pairs: SchedulePair[] };
export type ScheduleResponse = { itemName?: string; item?: string; interval?: string; tblData?: ScheduleDay[]; updatetime?: string; [key: string]: unknown };

export const rggu = {
  forms: () => post<{ eduform: { id: string; data: string; description: string }[]; course: { id: string; data: string }[] }>("Get_Eduforms_Courses_Lists"),
  flows: (eduform: string, course: string) => post<Flow[]>("Get_Flows_List", new URLSearchParams({ "0": JSON.stringify({ eduform, course }) })),
  teachers: () => post<{ id: string; data: string }[]>("Get_Teachers_List"),
  rooms: () => post<{ id: string; data: string }[]>("Get_Rooms_List"),
  departments: () => post<{ id: string; data: string }[]>("Get_Departments_List"),
  notice: () => post<{ title: string; rows: string[] }>("Get_Notice"),
  schedule: (fields: Record<string, string>) => post<ScheduleResponse>("Get_Schedule_Table", new URLSearchParams(fields))
};
