// Bridge for real-time seat API integration with safe local fallback.
function normalizeSeatStatus(status) {
  return status === "booked" || status === "reserved" ? status : "available";
}

function extractValidSeats(payload) {
  if (!payload || !Array.isArray(payload.seats)) {
    return [];
  }

  return payload.seats
    .map((seat) => {
      if (!seat || !seat.seatNumber) {
        return null;
      }

      return {
        seatNumber: String(seat.seatNumber),
        status: normalizeSeatStatus(seat.status),
      };
    })
    .filter(Boolean);
}

export async function fetchSeatStatuses(busId) {
  if (!busId) {
    return null;
  }

  try {
    const response = await fetch(`/api/seats?busId=${encodeURIComponent(busId)}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const seats = extractValidSeats(payload);
    return seats.length > 0 ? seats : null;
  } catch (_error) {
    return null;
  }
}

export async function createBookingRequest(payload) {
  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const body = await response.json();
    const seats = extractValidSeats(body);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: body?.error || "Booking request failed.",
        conflictSeats: Array.isArray(body?.conflictSeats)
          ? body.conflictSeats.map(String)
          : [],
        seats,
      };
    }

    if (!body?.booking || !body.booking.id) {
      return {
        ok: false,
        status: 500,
        message: "Booking API returned an invalid booking payload.",
        conflictSeats: [],
        seats,
      };
    }

    return {
      ok: true,
      status: response.status,
      booking: body.booking,
      seats,
    };
  } catch (_error) {
    return {
      ok: false,
      status: 0,
      message: "Could not reach booking service.",
      conflictSeats: [],
      seats: [],
    };
  }
}

export async function fetchBookingById(bookingId) {
  if (!bookingId) {
    return null;
  }

  try {
    const response = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return payload?.booking && payload.booking.id ? payload.booking : null;
  } catch (_error) {
    return null;
  }
}

export async function cancelBookingRequest(bookingId) {
  if (!bookingId) {
    return { ok: false, message: "No booking ID provided." };
  }

  try {
    const response = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
      method: "DELETE",
    });

    const body = await response.json();
    const seats = extractValidSeats(body);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: body?.error || "Cancel request failed.",
        seats,
      };
    }

    return {
      ok: true,
      status: response.status,
      booking: body.booking,
      seats,
    };
  } catch (_error) {
    return {
      ok: false,
      status: 0,
      message: "Could not reach booking service.",
      seats: [],
    };
  }
}

export async function modifyBookingRequest(bookingId, payload) {
  if (!bookingId) {
    return { ok: false, message: "No booking ID provided.", conflictSeats: [], seats: [] };
  }

  try {
    const response = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await response.json();
    const seats = extractValidSeats(body);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: body?.error || "Modify request failed.",
        conflictSeats: Array.isArray(body?.conflictSeats) ? body.conflictSeats.map(String) : [],
        seats,
      };
    }

    return {
      ok: true,
      status: response.status,
      booking: body.booking,
      seats,
    };
  } catch (_error) {
    return {
      ok: false,
      status: 0,
      message: "Could not reach booking service.",
      conflictSeats: [],
      seats: [],
    };
  }
}
