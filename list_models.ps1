$url = "https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCpKhs0sKbx2O7J7igILEnWRrddNs3m6JQ"
try {
    $response = Invoke-RestMethod -Uri $url -Method Get
    $response.models | Select-Object name, displayName, description | ConvertTo-Json
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
