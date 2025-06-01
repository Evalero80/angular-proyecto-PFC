import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common'; // Importa NgFor
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Evento } from './evento.model';
import { TiendatechService } from '../tiendatech.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  imports: [NgFor,DatePipe,CommonModule,FormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  standalone: true 
})
export class CalendarComponent implements OnInit{
   currentView: string = 'month';
  currentDate: Date = new Date();
  calendarGrid: { day: number | null; date: Date; isToday: boolean }[] = [];
  weekDays: { name: string; date: Date }[] = [];
  hours: string[] = [];
  currentViewTitle: string = '';
  eventos: Evento[] = [];
  selectedEvent: Evento | null = null;
  modoEdicion: boolean = false;

  constructor(private tiendaService: TiendatechService) {}

  ngOnInit(): void {
    this.renderCalendar();
    this.generateHours();
    this.cargarEventos();
  }

cargarEventos(): void {
  this.tiendaService.obtenerEventos().subscribe({
    next: (res: any) => {
      if (res && res.status === 'success' && Array.isArray(res.data)) {
        this.eventos = res.data;
      } else {
        this.eventos = [];
      }
      this.renderCalendar(); // Asegúrate de llamar a renderCalendar()
    },
    error: (err) => {
      console.error('Error al cargar eventos:', err);
      this.eventos = [];
      this.renderCalendar();
    }
  });
}

  crearEvento(): void {
    const title = (document.getElementById('title') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLTextAreaElement).value;
    const color = (document.getElementById('color') as HTMLInputElement).value;
    const start = (document.getElementById('start') as HTMLInputElement).value;
    const end = (document.getElementById('end') as HTMLInputElement).value;

    if (!title || !start || !end) {
      alert('Completa todos los campos obligatorios');
      return;
    }

    const nuevoEvento: Evento = {
      id: 0,
      titulo: title,
      descripcion: description,
      inicio: start,
      fin: end,
      color: color
    };

    this.tiendaService.guardarEvento(nuevoEvento).subscribe(() => {
      this.cargarEventos();
      this.limpiarFormulario();
    });
  }

limpiarFormulario(): void {
  (document.getElementById('title') as HTMLInputElement).value = '';
  (document.getElementById('description') as HTMLTextAreaElement).value = '';
  (document.getElementById('color') as HTMLInputElement).value = '#000000';
  (document.getElementById('start') as HTMLInputElement).value = '';
  (document.getElementById('end') as HTMLInputElement).value = '';
  this.modoEdicion = false;
  this.selectedEvent = null;
}

getEventsForDay(date: Date): Evento[] {
  return this.eventos.filter(evento => this.isEventInDate(date, evento));
}
getEventsForHour(date: Date, hour: string): Evento[] {
  const dateStr = date.toISOString().split('T')[0];
  const fullHour = `${dateStr}T${hour}`;
  const currentDateTime = new Date(fullHour);

  return this.eventos.filter(evento => {
    const eventoInicio = new Date(evento.inicio);
    const eventoFin = new Date(evento.fin);
    return eventoInicio <= currentDateTime && eventoFin > currentDateTime;
  });
}
isEventInDate(date: Date, evento: Evento): boolean {
  const eventoInicio = new Date(evento.inicio);
  const eventoFin = new Date(evento.fin);

  // Limpiar horas para comparar solo fechas
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  eventoInicio.setHours(0, 0, 0, 0);
  eventoFin.setHours(0, 0, 0, 0);

  return dateOnly >= eventoInicio && dateOnly <= eventoFin;
}


groupOverlappingEvents(events: Evento[]): Evento[][] {
  const groups: Evento[][] = [];

  for (const evento of events) {
    let placed = false;

    for (const group of groups) {
      const lastEvent = group[group.length - 1];
      if (new Date(evento.inicio) > new Date(lastEvent.fin)) {
        group.push(evento);
        placed = true;
        break;
      }
    }

    if (!placed) {
      groups.push([evento]);
    }
  }

  return groups;
}
// Muestra el modal con detalles del evento
showModal(evento: Evento): void {
  this.selectedEvent = { ...evento };
  const modal = document.getElementById('event-detail-modal');
  if (modal) modal.style.display = 'flex';
}


// Cierra el modal
closeModal(): void {
  this.selectedEvent = null;
  const modal = document.getElementById('event-detail-modal');
  if (modal) modal.style.display = 'none';
}
guardarCambios(): void {
  if (!this.selectedEvent || !this.selectedEvent.id) return;

  const title = (document.getElementById('edit-title') as HTMLInputElement).value;
  const description = (document.getElementById('edit-descripcion') as HTMLTextAreaElement).value;
  const start = (document.getElementById('edit-inicio') as HTMLInputElement).value;
  const end = (document.getElementById('edit-fin') as HTMLInputElement).value;
  const color = (document.getElementById('edit-color') as HTMLInputElement).value;

  if (!title || !start || !end) {
    alert("Completa todos los campos obligatorios");
    return;
  }

  const eventoActualizado: Evento = {
    id: this.selectedEvent.id,
    titulo: title,
    descripcion: description,
    inicio: start,
    fin: end,
    color: color
  };

  this.tiendaService.actualizarEvento(this.selectedEvent.id, eventoActualizado).subscribe(() => {
    this.cargarEventos(); // Refresca eventos
    this.closeModal();     // Cierra modal
  });
}










guardarEvento(): void {
  const title = (document.getElementById('title') as HTMLInputElement).value;
  const description = (document.getElementById('description') as HTMLTextAreaElement).value;
  const color = (document.getElementById('color') as HTMLInputElement).value;
  const start = (document.getElementById('start') as HTMLInputElement).value;
  const end = (document.getElementById('end') as HTMLInputElement).value;

  if (!title || !start || !end) {
    alert('Completa todos los campos obligatorios');
    return;
  }

  if (this.modoEdicion && this.selectedEvent) {
    // Modo edición - actualiza evento
    const eventoActualizado: Evento = {
      ...this.selectedEvent,
      titulo: title,
      descripcion: description,
      inicio: start,
      fin: end,
      color: color
    };

    this.tiendaService.actualizarEvento(this.selectedEvent.id, eventoActualizado).subscribe(() => {
      this.cargarEventos();
      this.limpiarFormulario();
    });
  } else {
    // Modo creación - crea nuevo evento
    const nuevoEvento: Evento = {
      id: 0,
      titulo: title,
      descripcion: description,
      inicio: start,
      fin: end,
      color: color
    };

    this.tiendaService.guardarEvento(nuevoEvento).subscribe(() => {
      this.cargarEventos();
      this.limpiarFormulario();
    });
  }
}
editarEvento(evento: Evento): void {
  this.modoEdicion = true;
  this.selectedEvent = { ...evento };

  // Rellenamos los campos del formulario
  const titleInput = document.getElementById('title') as HTMLInputElement;
  const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
  const colorInput = document.getElementById('color') as HTMLInputElement;
  const startInput = document.getElementById('start') as HTMLInputElement;
  const endInput = document.getElementById('end') as HTMLInputElement;

  if (titleInput) titleInput.value = evento.titulo;
  if (descriptionInput) descriptionInput.value = evento.descripcion;
  if (colorInput) colorInput.value = evento.color;
  if (startInput) startInput.value = evento.inicio;
  if (endInput) endInput.value = evento.fin;

  this.closeModal(); // Cerramos el modal y pasamos a editar
}
eliminarEvento(id: number): void {
  if (!confirm("¿Estás seguro de eliminar este evento?")) return;

  this.tiendaService.eliminarEvento(id).subscribe(() => {
    this.cargarEventos();   // Recarga lista
    this.closeModal();      // Cierra modal
  });
}
getTopPosition(evento: Evento): number {
  const inicio = new Date(evento.inicio);
  return inicio.getHours() * 40 + (inicio.getMinutes() / 60) * 40;
}

getEventHeight(evento: Evento): number {
  const inicio = new Date(evento.inicio);
  const fin = new Date(evento.fin);
  const diffMinutos = (fin.getTime() - inicio.getTime()) / (1000 * 60); // En minutos
  return Math.max(8, (diffMinutos / 60) * 40); // 40px por hora
}
generateHours(): void {
  for (let hour = 0; hour <= 23; hour++) {
    this.hours.push(`${hour.toString().padStart(2, '0')}:00`);
  }
}

renderCalendar(): void {
  if (this.currentView === 'month') {
    this.renderMonthView();
  } else if (this.currentView === 'week') {
    this.renderWeekView();
  } else if (this.currentView === 'day') {
    this.renderDayView();
  }
}

  renderMonthView(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = (firstDayOfMonth.getDay() + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    this.calendarGrid = [];

    for (let i = 0; i < startDay; i++) {
      const prevDate = new Date(year, month, -i);
      this.calendarGrid.push({ day: null, date: prevDate, isToday: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
      this.calendarGrid.push({ day, date, isToday });
    }

    const totalCells = this.calendarGrid.length;
    const cellsToComplete = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= cellsToComplete; i++) {
      const nextDate = new Date(year, month, daysInMonth + i);
      this.calendarGrid.push({ day: null, date: nextDate, isToday: false });
    }

    this.currentViewTitle = this.currentDate.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric'
    });
  }

  renderWeekView(): void {
    const startOfWeek = this.getStartOfWeek(this.currentDate);
    this.weekDays = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      this.weekDays.push({
        name: day.toLocaleDateString('es-ES', { weekday: 'short' }),
        date: day
      });
    }

    this.currentViewTitle = `${this.weekDays[0].date.toLocaleDateString()} - ${this.weekDays[6].date.toLocaleDateString()}`;
  }

  renderDayView(): void {
    this.currentViewTitle = this.currentDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  }

  prev(): void {
    if (this.currentView === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    } else if (this.currentView === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
    } else if (this.currentView === 'day') {
      this.currentDate.setDate(this.currentDate.getDate() - 1);
    }
    this.renderCalendar();
  }

  next(): void {
    if (this.currentView === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    } else if (this.currentView === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
    } else if (this.currentView === 'day') {
      this.currentDate.setDate(this.currentDate.getDate() + 1);
    }
    this.renderCalendar();
  }

  changeView(view: string): void {
    this.currentView = view;
    this.renderCalendar();
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }
}