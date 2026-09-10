package com.kisankalyan.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties,
                                 @Value("${spring.datasource.url}") String rawUrl,
                                 @Value("${spring.datasource.username:}") String username,
                                 @Value("${spring.datasource.password:}") String password) {
        // If the URL is provided by cloud hosts like Render, Neon, Supabase (e.g. postgres:// or postgresql://)
        if (StringUtils.hasText(rawUrl) && (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://"))) {
            try {
                URI uri = new URI(rawUrl);
                String userInfo = uri.getUserInfo();
                if (userInfo != null) {
                    String[] userParts = userInfo.split(":", 2);
                    if (!StringUtils.hasText(username)) {
                        username = userParts[0];
                    }
                    if (!StringUtils.hasText(password) && userParts.length > 1) {
                        password = userParts[1];
                    }
                }
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();
                String query = uri.getQuery();
                String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + path
                        + (query != null ? "?" + query : "");

                log.info("Converted cloud PostgreSQL URL to JDBC URL format: jdbc:postgresql://{}:{}{}", uri.getHost(), port, path);

                HikariDataSource dataSource = new HikariDataSource();
                dataSource.setJdbcUrl(jdbcUrl);
                dataSource.setUsername(username);
                dataSource.setPassword(password);
                dataSource.setDriverClassName("org.postgresql.Driver");
                return dataSource;
            } catch (Exception e) {
                log.warn("Failed to parse cloud database URI '{}', falling back to standard configuration: {}", rawUrl, e.getMessage());
            }
        }

        // Standard JDBC URL (e.g., jdbc:postgresql://localhost:5432/...)
        return properties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
    }
}
