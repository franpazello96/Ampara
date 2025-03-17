CREATE DATABASE Ampara;

CREATE TABLE Doador (
    Nome VARCHAR(40),
    CPF VARCHAR(14) PRIMARY KEY,
    Email VARCHAR(50),
    Telefone VARCHAR(11),
    Senha VARCHAR(30),
    UNIQUE (CPF, Email, Telefone)
);

CREATE TABLE Recebedor (
    Nome_instituicao VARCHAR(40),
    CNPJ VARCHAR(18) PRIMARY KEY,
    Email VARCHAR(40),
    Telefone VARCHAR(11),
    Nome_representante VARCHAR(40),
    CPF VARCHAR(14),
    UNIQUE (CNPJ, Email, Telefone, CPF)
);

CREATE TABLE Doacao_Dinheiro (
    ID INTEGER PRIMARY KEY UNIQUE,
    Valor_monetario FLOAT
);

CREATE TABLE Doacao_Alimento (
    Id INTEGER PRIMARY KEY UNIQUE,
    Quantidade INTEGER,
    Tipo VARCHAR(20),
    Medida FLOAT,
    Perecivel BOOLEAN
);

CREATE TABLE Relacionamento_1 (
    fk_Doacao_Alimento_Id INTEGER,
    fk_Doador_cpf VARCHAR(14)
);

CREATE TABLE Relacionamento_2 (
    fk_Doador_cpf VARCHAR(14),
    fk_Doacao_Dinheiro_id INTEGER
);

CREATE TABLE Relacionamento_3 (
    fk_Recebedor_cnpj VARCHAR(18),
    fk_Doacao_Alimento_Id INTEGER
);

CREATE TABLE Relacionamento_4 (
    fk_Doacao_Dinheiro_id INTEGER,
    fk_Recebedor_cnpj VARCHAR(18)
);
 
ALTER TABLE Relacionamento_1 ADD CONSTRAINT FK_Relacionamento_1_1
    FOREIGN KEY (fk_Doacao_Alimento_Id)
    REFERENCES Doacao_Alimento (Id)
    ON DELETE RESTRICT;
 
ALTER TABLE Relacionamento_1 ADD CONSTRAINT FK_Relacionamento_1_2
    FOREIGN KEY (fk_Doador_cpf)
    REFERENCES Doador (CPF)
    ON DELETE RESTRICT;
 
ALTER TABLE Relacionamento_2 ADD CONSTRAINT FK_Relacionamento_2_1
    FOREIGN KEY (fk_Doador_cpf)
    REFERENCES Doador (CPF)
    ON DELETE RESTRICT;
 
ALTER TABLE Relacionamento_2 ADD CONSTRAINT FK_Relacionamento_2_2
    FOREIGN KEY (fk_Doacao_Dinheiro_id)
    REFERENCES Doacao_Dinheiro (ID)
    ON DELETE RESTRICT;
 
ALTER TABLE Relacionamento_3 ADD CONSTRAINT FK_Relacionamento_3_1
    FOREIGN KEY (fk_Recebedor_cnpj)
    REFERENCES Recebedor (CNPJ)
    ON DELETE RESTRICT;
 
ALTER TABLE Relacionamento_3 ADD CONSTRAINT FK_Relacionamento_3_2
    FOREIGN KEY (fk_Doacao_Alimento_Id)
    REFERENCES Doacao_Alimento (Id)
    ON DELETE RESTRICT;
 
ALTER TABLE Relacionamento_4 ADD CONSTRAINT FK_Relacionamento_4_1
    FOREIGN KEY (fk_Doacao_Dinheiro_id)
    REFERENCES Doacao_Dinheiro (ID)
    ON DELETE RESTRICT;
 
ALTER TABLE Relacionamento_4 ADD CONSTRAINT FK_Relacionamento_4_2
    FOREIGN KEY (fk_Recebedor_cnpj)
    REFERENCES Recebedor (CNPJ)
    ON DELETE RESTRICT;
