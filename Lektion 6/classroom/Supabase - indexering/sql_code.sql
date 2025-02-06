-- Det här är de kommandon som ni behöver köra i Supabase SQL-editor

-- Lägg till vectortillägget pgvetor
CREATE EXTENSION IF NOT EXISTS vector;

-- Skapa tabellen
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    text TEXT,
    embedding vector(384) -- Vi använder en mindre modell som ger en embedding på 384
);


-- Skapa vår cosinuslikhets-beräkning - testa att köra denna först utan indexering, och sen efter att ni lagt till indexering.
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(384),
  match_threshold float,
  match_count int
) RETURNS TABLE (
  id INT,
  text TEXT,
  similarity FLOAT
) LANGUAGE sql STABLE AS $$
SELECT id, text, 1 - (embedding <=> query_embedding) AS similarity
FROM documents
WHERE 1 - (embedding <=> query_embedding) > match_threshold
ORDER BY similarity DESC
LIMIT match_count;
$$;


-- För att skapa ett index för våra embeddings - kör denna i SQL-editorn i Supabase
CREATE INDEX ON documents USING ivfflat (embedding);
