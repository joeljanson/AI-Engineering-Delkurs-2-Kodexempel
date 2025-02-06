
/* Skapa en semantisk sök funktion */

create or replace function match_documents (
  query_embedding vector(1024),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  sentence text,
  similarity float
)
language sql stable
as $$
  select
    documents.id,
    documents.sentence,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where documents.embedding <=> query_embedding < 1 - match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
$$;