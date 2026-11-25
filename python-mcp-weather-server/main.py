from mcp_weather_server.server import app, register_all_tools
from mcp_http import serve

register_all_tools()

if __name__ == "__main__":
    serve(
        title="Weather MCP Server",
        repository="https://github.com/isdaniel/mcp_weather_server",
        license_name="Apache-2.0",
        package="mcp-weather-server",
        version="0.6.1",
        required_env=["MCP_AUTH_TOKEN"],
        adapter="in-process",
        summary="Current weather, air quality, and timezone lookups from Open-Meteo. No API key.",
        slug="weather",
        mcp_server=app,
        limits="Reads public forecast data only. It does not store queries.",
    )
