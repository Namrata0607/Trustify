export const validateInput = (schema, data) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errorDetails = result.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    const error = new Error("Validation Error");
    error.status = 400;
    error.details = errorDetails;
    throw error;
  }

  return result.data;
};
