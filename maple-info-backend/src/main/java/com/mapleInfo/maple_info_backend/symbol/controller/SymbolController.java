package com.mapleInfo.maple_info_backend.symbol.controller;

import com.mapleInfo.maple_info_backend.symbol.dto.SymbolCalcRequest;
import com.mapleInfo.maple_info_backend.symbol.dto.SymbolCalcResponse;
import com.mapleInfo.maple_info_backend.symbol.service.SymbolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/symbol")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SymbolController {

    private final SymbolService symbolService;

    @PostMapping("/calculate")
    public ResponseEntity<SymbolCalcResponse> calculateSymbol(@RequestBody SymbolCalcRequest request) {
        SymbolCalcResponse response = symbolService.calculateGraduation(request);
        return ResponseEntity.ok(response);
    }
}