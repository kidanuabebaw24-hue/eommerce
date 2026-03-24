$url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=AIzaSyCpKhs0sKbx2O7J7igILEnWRrddNs3m6JQ"
$headers = @{
    "Content-Type" = "application/json"
}
$body = @{
    contents = @(
        @{
            parts = @(
                @{
                    text = "Hello, are you online?"
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
    Write-Output "Status: Success"
    Write-Output ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $respBody = $reader.ReadToEnd()
        Write-Output "Error Response: $respBody"
    }
}
