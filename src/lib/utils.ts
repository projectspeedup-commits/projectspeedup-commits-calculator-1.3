import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { auth } from "./firebase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function getTimestampedFilename(baseName: string) {
  const now = new Date();
  const timestamp = now.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).replace(",", "");
  return `${baseName}, ${timestamp}.xlsx`;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  errorType?: "range" | "format" | "required";
}

/**
 * Validates numeric input for the metal calculator.
 */
export function validateNumeric(
  value: string | number,
  params: {
    min?: number;
    max?: number;
    allowZero?: boolean;
    fieldName?: string;
  } = {}
): ValidationResult {
  const { min = 0, max, allowZero = false, fieldName = "Поле" } = params;
  const numValue = Number(String(value).replace(/\s/g, "").replace(",", "."));

  if (isNaN(numValue)) {
    return { 
      isValid: false, 
      message: `${fieldName} должно быть числом`, 
      errorType: "format" 
    };
  }

  if (numValue === 0 && !allowZero) {
    return { 
      isValid: false, 
      message: `${fieldName} не может быть нулевым`, 
      errorType: "range" 
    };
  }

  if (numValue < min) {
    return { 
      isValid: false, 
      message: `${fieldName} не может быть меньше ${min}`, 
      errorType: "range" 
    };
  }

  if (max !== undefined && numValue > max) {
    return { 
      isValid: false, 
      message: `${fieldName} не может превышать ${max}`, 
      errorType: "range" 
    };
  }

  return { isValid: true };
}

/**
 * Validates drawing dimensions for the rolling process.
 */
export function validateDimensions(
  target: string | number,
  raw: string | number
): ValidationResult {
  const t = Number(target);
  const r = Number(raw);

  if (!t || !r) return { isValid: false, message: "Не указаны размеры", errorType: "required" };
  
  if (r <= t) {
    return { 
      isValid: false, 
      message: "Размер заготовки должен быть больше готового размера", 
      errorType: "range" 
    };
  }

  // Common technical constraint: ratio should not be too high for single pass
  const ratio = Math.pow(r / t, 2);
  if (ratio > 2.5) {
    return { 
      isValid: false, 
      message: "Слишком большой коэффициент вытяжки. Возможно, требуется промежуточный отжиг.", 
      errorType: "range" 
    };
  }

  return { isValid: true };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo:
        auth?.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  const errorMessage = JSON.stringify(errInfo);
  console.error("Firestore Error: ", errorMessage);
  throw new Error(errorMessage);
}
