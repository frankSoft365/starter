
export default function FieldInfo({ field }: { field: any }) {
    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <em className="text-red-500">
                    {field.state.meta.errors[0]?.message}
                </em>
            ) : null}
            {field.state.meta.isValidating ? 'Validating...' : null}
        </>
    )
}