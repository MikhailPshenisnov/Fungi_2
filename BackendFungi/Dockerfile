FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore ./BackendFungi.csproj
RUN dotnet publish ./BackendFungi.csproj -c Release -o /app/out --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "BackendFungi.dll"]
