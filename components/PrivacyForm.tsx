
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
    consent: boolean;
}

export default function PrivacyForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            // Simulação de envio para API (futuramente integrar com Route Handler)
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Aqui entraria a chamada real:
            // const res = await fetch('/api/privacy/request', { ... })

            console.log('Form data:', data);
            setSuccess(true);
            reset();
        } catch (err) {
            setError('Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente ou entre em contato direto pelo e-mail.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-fade-in-up">
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-2 font-sans tracking-tight">Solicitação Recebida</h3>
                <p className="text-green-700 max-w-md mx-auto">
                    Recebemos o seu pedido. Um e-mail será enviado para você assim que seus dados forem processados.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 text-green-700 font-medium hover:text-green-800 underline underline-offset-2"
                >
                    Enviar nova solicitação
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nome */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Seu nome (obrigatório)
                        </label>
                        <input
                            id="name"
                            type="text"
                            className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                                }`}
                            placeholder="Nome completo"
                            {...register('name', { required: 'Nome é obrigatório' })}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Seu e-mail (obrigatório)
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                                }`}
                            placeholder="seu@email.com"
                            {...register('email', {
                                required: 'E-mail é obrigatório',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'E-mail inválido',
                                }
                            })}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.email.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Assunto */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Assunto (Selecione uma opção)
                    </label>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <input
                                id="subject-access"
                                type="radio"
                                value="Solicitar cópia dos dados"
                                defaultChecked
                                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                {...register('subject')}
                            />
                            <label htmlFor="subject-access" className="ml-3 block text-sm text-gray-700">
                                Solicite uma cópia dos dados que temos sobre você.
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="subject-delete"
                                type="radio"
                                value="Solicitar exclusão dos dados"
                                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                {...register('subject')}
                            />
                            <label htmlFor="subject-delete" className="ml-3 block text-sm text-gray-700">
                                Solicite para excluirmos os seus dados (comentários e email cadastrados).
                            </label>
                        </div>
                    </div>
                </div>

                {/* Mensagem */}
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Sua mensagem (Opcional)
                    </label>
                    <textarea
                        id="message"
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none"
                        placeholder="Detalhes adicionais sobre sua solicitação..."
                        {...register('message')}
                    />
                </div>

                {/* Consentimento */}
                <div className={`p-4 rounded-lg bg-gray-100 ${errors.consent ? 'border border-red-300 bg-red-50' : ''}`}>
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="consent"
                                type="checkbox"
                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                {...register('consent', { required: 'Você precisa aceitar os termos para continuar.' })}
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="consent" className="font-medium text-gray-700">
                                Eu revi a Política de Privacidade e dou meu consentimento aos termos estabelecidos.
                            </label>
                            {errors.consent && (
                                <p className="mt-1 text-red-600 text-xs">
                                    {errors.consent.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processando...
                        </>
                    ) : (
                        'Enviar Solicitação'
                    )}
                </button>
            </form>
        </div>
    );
}
