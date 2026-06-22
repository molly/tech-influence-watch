import { Timestamp } from "firebase/firestore";

/**
 * Recursively convert Firestore values into plain, serializable JS values.
 *
 * Firestore `Timestamp` objects carry a `toJSON` method, which Next.js refuses
 * to pass from a Server Component to a Client Component ("Only plain objects can
 * be passed..."). Backend docs increasingly include an `updated_at` Timestamp
 * that frontend components never read, so we strip the non-plain wrapper at the
 * fetch boundary by converting Timestamps to epoch milliseconds — the same
 * representation timestamps already use elsewhere in our types (e.g.
 * Elections.ts `lastReviewed`).
 */
export function serializeFirestore<T>(value: T): T {
  if (value instanceof Timestamp) {
    return value.toMillis() as unknown as T;
  }
  // Duck-type Timestamps that may originate from a different firebase module
  // instance, where `instanceof` can fail.
  if (
    value !== null &&
    typeof value === "object" &&
    typeof (value as { toMillis?: unknown }).toMillis === "function" &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    return (value as unknown as Timestamp).toMillis() as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => serializeFirestore(item)) as unknown as T;
  }
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = serializeFirestore(val);
    }
    return result as T;
  }
  return value;
}
