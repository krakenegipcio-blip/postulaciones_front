$inputFile = "c:\Users\djara\Documents\REPOSITORIOS\POSTULACIONES\postulaciones_analisis_final\docs\misc\dumps\dump-postgres-202606181823.sql"
$outputFile = "c:\Users\djara\Documents\REPOSITORIOS\POSTULACIONES\postulaciones_analisis_final\docs\misc\dumps\dump-neondb-clean.sql"

$content = Get-Content $inputFile -Raw

# Remove \restrict and \unrestrict lines
$content = $content -replace '(?m)^\\restrict[^\r\n]*[\r\n]+', ''
$content = $content -replace '(?m)^\\unrestrict[^\r\n]*[\r\n]+', ''

# Replace OWNER TO postgres -> OWNER TO neondb_owner
$content = $content -replace 'OWNER TO postgres', 'OWNER TO neondb_owner'

# Remove SET transaction_timeout (not supported in Neon)
$content = $content -replace '(?m)^SET transaction_timeout = 0;[\r\n]+', ''

$content | Set-Content $outputFile -Encoding UTF8

Write-Host "Dump limpio creado en: $outputFile"
