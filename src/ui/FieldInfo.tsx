import { useTranslation } from "react-i18next"

export default function FieldInfo({ field }: { field: any }) {
    const { t } = useTranslation();
    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <em className="text-red-500">
                    {t(field.state.meta.errors[0]?.message)}
                </em>
            ) : null}
            {field.state.meta.isValidating ? 'Validating...' : null}
        </>
    )
}