-- CreateTable
CREATE TABLE "paciente" (
    "id" SERIAL NOT NULL,
    "CPF" VARCHAR(14) NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "data_nascimento" DATE,
    "peso_kg" DOUBLE PRECISION,
    "genero" VARCHAR(100) NOT NULL,
    "aceite_termos" BOOLEAN NOT NULL DEFAULT true,
    "data_cadastro" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_attempts" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "ip_address" VARCHAR(45),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "blocked_until" BIGINT,
    "last_attempt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicos" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "crm" VARCHAR(20) NOT NULL,
    "especialidade" VARCHAR(100),
    "email" VARCHAR(150) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "telefone" VARCHAR(16) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "medicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicamentos" (
    "id_medicamento" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "tipo" VARCHAR(50),
    "descricao" TEXT,
    "faixa_etaria_minima" INTEGER,
    "faixa_etaria_maxima" INTEGER,
    "contraindicacoes" TEXT,
    "interacoes_comuns" TEXT,
    "composicao" TEXT,
    "dosagem_padrao" VARCHAR(50),
    "bula_detalhada" TEXT,

    CONSTRAINT "medicamentos_pkey" PRIMARY KEY ("id_medicamento")
);

-- CreateTable
CREATE TABLE "bulas" (
    "id" SERIAL NOT NULL,
    "id_medicamento" INTEGER NOT NULL,
    "dosagem_e_administracao" TEXT[],
    "indicacoes" TEXT[],
    "contraindicacoes" TEXT[],
    "advertencias" TEXT[],
    "interacoes_medicamentosas" TEXT[],
    "armazenamento_e_validade" TEXT[],

    CONSTRAINT "bulas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescricoes" (
    "id_prescricao" SERIAL NOT NULL,
    "id_paciente" INTEGER NOT NULL,
    "crm" TEXT,
    "diagnostico" TEXT NOT NULL,
    "data_prescricao" DATE NOT NULL,
    "validade" DATE,
    "data_cadastro" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prescricoes_pkey" PRIMARY KEY ("id_prescricao")
);

-- CreateTable
CREATE TABLE "medicamentos_prescritos" (
    "id_medicamento_prescrito" SERIAL NOT NULL,
    "id_prescricao" INTEGER NOT NULL,
    "id_medicamento" INTEGER NOT NULL,
    "dosagem" VARCHAR(50),
    "frequencia" VARCHAR(50),
    "duracao_dias" INTEGER,
    "horarios" VARCHAR(255),
    "via" VARCHAR(50),

    CONSTRAINT "medicamentos_prescritos_pkey" PRIMARY KEY ("id_medicamento_prescrito")
);

-- CreateTable
CREATE TABLE "lembretes" (
    "id_lembrete" SERIAL NOT NULL,
    "id_paciente" INTEGER NOT NULL,
    "id_prescricao" INTEGER NOT NULL,
    "id_medicamento" INTEGER NOT NULL,
    "horario" TIME(6) NOT NULL,
    "data_inicio" DATE NOT NULL,
    "data_fim" DATE NOT NULL,
    "canal_envio" VARCHAR(20) NOT NULL,
    "enviado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "lembretes_pkey" PRIMARY KEY ("id_lembrete")
);

-- CreateTable
CREATE TABLE "favoritos" (
    "id_favorito" SERIAL NOT NULL,
    "id_paciente" INTEGER NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "referencia_id" INTEGER NOT NULL,
    "data_favoritado" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("id_favorito")
);

-- CreateTable
CREATE TABLE "historico_interacoes" (
    "id_historico" SERIAL NOT NULL,
    "id_paciente" INTEGER NOT NULL,
    "tipo" VARCHAR(30) NOT NULL,
    "descricao" TEXT,
    "data_hora" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_interacoes_pkey" PRIMARY KEY ("id_historico")
);

-- CreateTable
CREATE TABLE "otps" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "otp" VARCHAR(10) NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "paciente_CPF_key" ON "paciente"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "paciente_email_key" ON "paciente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "medicos_crm_key" ON "medicos"("crm");

-- CreateIndex
CREATE UNIQUE INDEX "medicos_email_key" ON "medicos"("email");

-- CreateIndex
CREATE UNIQUE INDEX "bulas_id_medicamento_key" ON "bulas"("id_medicamento");

-- AddForeignKey
ALTER TABLE "bulas" ADD CONSTRAINT "bulas_id_medicamento_fkey" FOREIGN KEY ("id_medicamento") REFERENCES "medicamentos"("id_medicamento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescricoes" ADD CONSTRAINT "prescricoes_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescricoes" ADD CONSTRAINT "prescricoes_crm_fkey" FOREIGN KEY ("crm") REFERENCES "medicos"("crm") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicamentos_prescritos" ADD CONSTRAINT "medicamentos_prescritos_id_prescricao_fkey" FOREIGN KEY ("id_prescricao") REFERENCES "prescricoes"("id_prescricao") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicamentos_prescritos" ADD CONSTRAINT "medicamentos_prescritos_id_medicamento_fkey" FOREIGN KEY ("id_medicamento") REFERENCES "medicamentos"("id_medicamento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lembretes" ADD CONSTRAINT "lembretes_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lembretes" ADD CONSTRAINT "lembretes_id_prescricao_fkey" FOREIGN KEY ("id_prescricao") REFERENCES "prescricoes"("id_prescricao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lembretes" ADD CONSTRAINT "lembretes_id_medicamento_fkey" FOREIGN KEY ("id_medicamento") REFERENCES "medicamentos"("id_medicamento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_interacoes" ADD CONSTRAINT "historico_interacoes_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
